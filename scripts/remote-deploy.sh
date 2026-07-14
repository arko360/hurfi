#!/usr/bin/env bash
# Runs on the Hostinger server after artifacts are uploaded to a staging directory.
# Args: <staging_dir> <artifact_mode> <git_sha>
# Hostinger-safe: no mapfile / process substitution / assume rsync may be missing.
set -eu

STAGING="${1:?staging dir required}"
MODE="${2:-static}"
SHA="${3:-unknown}"

DEPLOY_PATH="${DEPLOY_PATH:-/home/u765323536/domains/hurfi.com/public_html}"
REPO_PATH="${REPO_PATH:-/home/u765323536/domains/hurfi.com/repo}"
RELEASES_PATH="${RELEASES_PATH:-/home/u765323536/domains/hurfi.com/releases}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

log() { echo "[deploy] $*"; }
die() { echo "[deploy][ERROR] $*" >&2; exit 1; }

[ -d "$STAGING" ] || die "Staging directory missing: $STAGING"
[ -d "$DEPLOY_PATH" ] || die "Deploy path missing: $DEPLOY_PATH"

activate_node() {
  for p in \
    /opt/alt/alt-nodejs22/root/usr/bin \
    /opt/alt/alt-nodejs20/root/usr/bin \
    /opt/alt/alt-nodejs24/root/usr/bin \
    /opt/alt/alt-nodejs18/root/usr/bin
  do
    if [ -x "$p/node" ]; then
      export PATH="$p:$PATH"
      log "Using Node from $p ($(node -v 2>/dev/null || true))"
      return 0
    fi
  done
  return 1
}

# Copy staging → webroot, keeping Hostinger panel files
publish_static() {
  local src="$1"
  local dest="$2"

  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete \
      --exclude='.user.ini' \
      --exclude='cgi-bin' \
      --exclude='default.php' \
      "$src"/ "$dest"/
  else
    log "rsync not found — using portable cp publish"
    # Remove old publishable files (keep Hostinger specials except .htaccess which we manage)
    if [ -d "$dest" ]; then
      for item in "$dest"/* "$dest"/.[!.]* "$dest"/..?*; do
        [ -e "$item" ] || continue
        base=$(basename "$item")
        case "$base" in
          .|..) continue ;;
          .user.ini|cgi-bin|default.php) continue ;;
        esac
        rm -rf "$item"
      done
    fi
    mkdir -p "$dest"
    cp -a "$src"/. "$dest"/
  fi

  if [ -f "$dest/index.html" ] || [ -f "$dest/index.php" ]; then
    rm -f "$dest/default.php" || true
  fi
}

prune_releases() {
  [ -d "$RELEASES_PATH" ] || return 0

  # Portable: no mapfile / no process substitution (Hostinger CageFS)
  count=0
  # shellcheck disable=SC2012
  for old in $(ls -1dt "$RELEASES_PATH"/* 2>/dev/null); do
    count=$((count + 1))
    if [ "$count" -gt "$KEEP_RELEASES" ]; then
      log "Pruning old release: $old"
      rm -rf "$old"
    fi
  done
}

if [ -f "$STAGING/.deploy-noop.json" ]; then
  log "No-op deploy (empty/placeholder project). Live site unchanged."
  cat "$STAGING/.deploy-noop.json" || true
  exit 0
fi

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
SHORT_SHA="$(printf '%s' "$SHA" | cut -c1-7)"
RELEASE_DIR="$RELEASES_PATH/${TIMESTAMP}_${SHORT_SHA}"
mkdir -p "$RELEASE_DIR"

log "Creating release snapshot of current public_html → $RELEASE_DIR"
cp -a "$DEPLOY_PATH"/. "$RELEASE_DIR"/ 2>/dev/null || true
printf '%s\n' "$SHA" > "$RELEASE_DIR/.release-sha"
printf '%s\n' "$TIMESTAMP" > "$RELEASE_DIR/.release-time"

if [ -d "$REPO_PATH/.git" ]; then
  log "Updating git mirror at $REPO_PATH"
  git -C "$REPO_PATH" fetch origin || true
  git -C "$REPO_PATH" checkout -f main || true
  git -C "$REPO_PATH" reset --hard "origin/main" || true
else
  log "Git mirror missing; cloning..."
  mkdir -p "$(dirname "$REPO_PATH")"
  git clone https://github.com/arko360/hurfi.git "$REPO_PATH" || true
fi

case "$MODE" in
  noop)
    log "Mode=noop; skipping publish."
    ;;
  static|laravel)
    log "Publishing $MODE artifacts into $DEPLOY_PATH"
    publish_static "$STAGING" "$DEPLOY_PATH"
    ;;
  node)
    log "Publishing Node app into $DEPLOY_PATH"
    activate_node || log "WARNING: Node binary not found on PATH; start step may fail."
    publish_static "$STAGING" "$DEPLOY_PATH"
    if [ -f "$DEPLOY_PATH/package.json" ]; then
      (cd "$DEPLOY_PATH" && npm install --omit=dev) || log "WARNING: npm install failed"
    fi
    if command -v pm2 >/dev/null 2>&1; then
      pm2 restart hurfi || pm2 start "$DEPLOY_PATH/start.sh" --name hurfi || true
    else
      mkdir -p "$DEPLOY_PATH/tmp"
      date > "$DEPLOY_PATH/tmp/restart.txt"
      log "Wrote Passenger-style restart marker (if applicable)."
    fi
    log "If this is a Hostinger Node.js App, restart it once in hPanel after first deploy."
    ;;
  *)
    die "Unknown artifact mode: $MODE"
    ;;
esac

prune_releases

log "Deploy complete. mode=$MODE sha=$SHA path=$DEPLOY_PATH"
