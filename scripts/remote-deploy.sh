#!/usr/bin/env bash
# Runs on the Hostinger server after artifacts are uploaded to a staging directory.
# Args: <staging_dir> <artifact_mode> <git_sha>
set -euo pipefail

STAGING="${1:?staging dir required}"
MODE="${2:-static}"
SHA="${3:-unknown}"

DEPLOY_PATH="${DEPLOY_PATH:-/home/u765323536/domains/hurfi.com/public_html}"
REPO_PATH="${REPO_PATH:-/home/u765323536/domains/hurfi.com/repo}"
RELEASES_PATH="${RELEASES_PATH:-/home/u765323536/domains/hurfi.com/releases}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

log() { echo "[deploy] $*"; }
die() { echo "[deploy][ERROR] $*" >&2; exit 1; }

[[ -d "$STAGING" ]] || die "Staging directory missing: $STAGING"
[[ -d "$DEPLOY_PATH" ]] || die "Deploy path missing: $DEPLOY_PATH"

# Activate Node on Hostinger if present (optional for node modes)
activate_node() {
  for p in \
    /opt/alt/alt-nodejs22/root/usr/bin \
    /opt/alt/alt-nodejs20/root/usr/bin \
    /opt/alt/alt-nodejs24/root/usr/bin \
    /opt/alt/alt-nodejs18/root/usr/bin
  do
    if [[ -x "$p/node" ]]; then
      export PATH="$p:$PATH"
      log "Using Node from $p ($(node -v 2>/dev/null || true))"
      return 0
    fi
  done
  return 1
}

# Noop marker: do not wipe live site when repo has no app yet
if [[ -f "$STAGING/.deploy-noop.json" ]]; then
  log "No-op deploy (empty/placeholder project). Live site unchanged."
  cat "$STAGING/.deploy-noop.json" || true
  exit 0
fi

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="$RELEASES_PATH/${TIMESTAMP}_${SHA:0:7}"
mkdir -p "$RELEASE_DIR"

log "Creating release snapshot of current public_html → $RELEASE_DIR"
# Snapshot existing webroot (best-effort rollback)
cp -a "$DEPLOY_PATH"/. "$RELEASE_DIR"/ 2>/dev/null || true
echo "$SHA" > "$RELEASE_DIR/.release-sha"
echo "$TIMESTAMP" > "$RELEASE_DIR/.release-time"

# Keep git mirror up to date for rollback / inspection
if [[ -d "$REPO_PATH/.git" ]]; then
  log "Updating git mirror at $REPO_PATH"
  git -C "$REPO_PATH" fetch origin || true
  git -C "$REPO_PATH" checkout main || true
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
    # Preserve Hostinger / panel files if present
    rsync -a --delete \
      --exclude='.htaccess' \
      --exclude='.user.ini' \
      --exclude='cgi-bin' \
      --exclude='default.php' \
      "$STAGING"/ "$DEPLOY_PATH"/
    # Prefer real index over Hostinger placeholder
    if [[ -f "$DEPLOY_PATH/index.html" || -f "$DEPLOY_PATH/index.php" ]]; then
      rm -f "$DEPLOY_PATH/default.php" || true
    fi
    ;;
  node)
    log "Publishing Node app into $DEPLOY_PATH"
    activate_node || log "WARNING: Node binary not found on PATH; start step may fail."
    rsync -a --delete \
      --exclude='.htaccess' \
      --exclude='.user.ini' \
      --exclude='cgi-bin' \
      "$STAGING"/ "$DEPLOY_PATH"/
    if [[ -f "$DEPLOY_PATH/package.json" ]]; then
      (cd "$DEPLOY_PATH" && npm install --omit=dev) || log "WARNING: npm install failed"
    fi
    # Hostinger Node apps are usually managed in hPanel (not systemd/pm2).
    # Touch a reload marker and try passenger/pm2 if available.
    if command -v pm2 >/dev/null 2>&1; then
      pm2 restart hurfi || pm2 start "$DEPLOY_PATH/start.sh" --name hurfi || true
    elif [[ -f "$DEPLOY_PATH/tmp/restart.txt" ]]; then
      touch "$DEPLOY_PATH/tmp/restart.txt"
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

# Prune old releases
if [[ -d "$RELEASES_PATH" ]]; then
  mapfile -t ALL_RELEASES < <(ls -1dt "$RELEASES_PATH"/* 2>/dev/null || true)
  if ((${#ALL_RELEASES[@]} > KEEP_RELEASES)); then
    for old in "${ALL_RELEASES[@]:$KEEP_RELEASES}"; do
      log "Pruning old release: $old"
      rm -rf "$old"
    done
  fi
fi

log "Deploy complete. mode=$MODE sha=$SHA path=$DEPLOY_PATH"
