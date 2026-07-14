#!/usr/bin/env bash
# Detects framework and builds deployable artifacts into ./deploy_artifact
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ARTIFACT_DIR="$ROOT/deploy_artifact"
rm -rf "$ARTIFACT_DIR"
mkdir -p "$ARTIFACT_DIR"

log() { echo "::notice::$*"; }
err() { echo "::error::$*"; }
set_output() {
  local name="$1"
  local value="$2"
  if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    echo "${name}=${value}" >> "$GITHUB_OUTPUT"
  fi
  echo "DETECT_${name}=${value}"
}

has_dep() {
  local pkg="$1"
  [[ -f package.json ]] || return 1
  node -e "const p=require('./package.json'); const d={...p.dependencies,...p.devDependencies}; process.exit(d['$pkg']?0:1)" 2>/dev/null
}

detect() {
  if [[ -f composer.json ]] && grep -qE '"laravel/framework"' composer.json; then
    echo "laravel"
    return
  fi
  if [[ -f package.json ]]; then
    if has_dep "next"; then echo "next"; return; fi
    if has_dep "astro"; then echo "astro"; return; fi
    if has_dep "vite" || [[ -f vite.config.js ]] || [[ -f vite.config.ts ]] || [[ -f vite.config.mjs ]]; then echo "vite"; return; fi
    if has_dep "react-scripts"; then echo "cra"; return; fi
    if has_dep "@angular/core"; then echo "angular"; return; fi
    if has_dep "nuxt"; then echo "nuxt"; return; fi
    echo "node"
    return
  fi
  if [[ -f index.html ]] || [[ -d public && -f public/index.html ]]; then
    echo "static"
    return
  fi
  echo "empty"
}

install_node_deps() {
  if [[ -f package-lock.json ]]; then
    npm ci
  elif [[ -f pnpm-lock.yaml ]]; then
    corepack enable
    pnpm install --frozen-lockfile
  elif [[ -f yarn.lock ]]; then
    corepack enable
    yarn install --frozen-lockfile
  else
    npm install
  fi
}

copy_dir() {
  local src="$1"
  if [[ ! -d "$src" ]]; then
    err "Expected build output directory missing: $src"
    return 1
  fi
  cp -a "$src"/. "$ARTIFACT_DIR"/
  log "Copied $src → deploy_artifact"
}

FRAMEWORK="$(detect)"
log "Detected framework: $FRAMEWORK"
set_output "framework" "$FRAMEWORK"

case "$FRAMEWORK" in
  empty)
    log "No application source found (placeholder repo). Skipping build."
    # Tiny status marker so the remote script can skip content wipe
    printf '%s\n' "{\"status\":\"noop\",\"framework\":\"empty\",\"builtAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$ARTIFACT_DIR/.deploy-noop.json"
    set_output "artifact_mode" "noop"
    set_output "skip_deploy" "true"
    exit 0
    ;;
  static)
    if [[ -d public && -f public/index.html ]]; then
      copy_dir public
    else
      # Copy common static assets from repo root
      shopt -s nullglob
      for item in index.html 404.html favicon.ico robots.txt sitemap.xml css js assets images img fonts media; do
        if [[ -e "$item" ]]; then
          cp -a "$item" "$ARTIFACT_DIR"/
        fi
      done
      shopt -u nullglob
    fi
    set_output "artifact_mode" "static"
    set_output "skip_deploy" "false"
    ;;
  next)
    install_node_deps
    npm run build
    if [[ -d out ]]; then
      copy_dir out
      set_output "artifact_mode" "static"
    elif [[ -d .next/standalone ]]; then
      mkdir -p "$ARTIFACT_DIR"
      cp -a .next/standalone/. "$ARTIFACT_DIR"/
      mkdir -p "$ARTIFACT_DIR/.next"
      cp -a .next/static "$ARTIFACT_DIR/.next/" 2>/dev/null || true
      [[ -d public ]] && cp -a public "$ARTIFACT_DIR/" || true
      set_output "artifact_mode" "node"
      printf '%s\n' 'node server.js' > "$ARTIFACT_DIR/start.sh"
    else
      err "Next.js build finished but neither 'out/' (static export) nor '.next/standalone' exists."
      err "For Hostinger shared hosting, set output: 'export' in next.config, or enable Node.js app + standalone."
      exit 1
    fi
    set_output "skip_deploy" "false"
    ;;
  vite|astro)
    install_node_deps
    npm run build
    if [[ -d dist ]]; then
      copy_dir dist
    else
      err "Build finished but dist/ was not found."
      exit 1
    fi
    set_output "artifact_mode" "static"
    set_output "skip_deploy" "false"
    ;;
  cra)
    install_node_deps
    npm run build
    copy_dir build
    set_output "artifact_mode" "static"
    set_output "skip_deploy" "false"
    ;;
  angular)
    install_node_deps
    npm run build
    # Prefer dist/*/browser if present
    if [[ -d dist ]]; then
      browser_dir="$(find dist -type d -name browser | head -n 1 || true)"
      if [[ -n "$browser_dir" ]]; then
        copy_dir "$browser_dir"
      else
        # Fallback: first subdirectory under dist, else dist itself
        first="$(find dist -mindepth 1 -maxdepth 1 -type d | head -n 1 || true)"
        if [[ -n "$first" ]]; then copy_dir "$first"; else copy_dir dist; fi
      fi
    else
      err "Angular build finished but dist/ was not found."
      exit 1
    fi
    set_output "artifact_mode" "static"
    set_output "skip_deploy" "false"
    ;;
  nuxt)
    install_node_deps
    npm run generate 2>/dev/null || npm run build
    if [[ -d .output/public ]]; then
      copy_dir .output/public
      set_output "artifact_mode" "static"
    elif [[ -d dist ]]; then
      copy_dir dist
      set_output "artifact_mode" "static"
    else
      err "Nuxt build/generate finished but no static output was found."
      exit 1
    fi
    set_output "skip_deploy" "false"
    ;;
  node)
    install_node_deps
    if node -e "const p=require('./package.json'); process.exit(p.scripts&&p.scripts.build?0:1)"; then
      npm run build
    else
      log "No build script; deploying Node app sources."
    fi
    # Prefer common output dirs
    if [[ -d dist ]]; then copy_dir dist; set_output "artifact_mode" "static"
    elif [[ -d build ]]; then copy_dir build; set_output "artifact_mode" "static"
    elif [[ -d public ]]; then copy_dir public; set_output "artifact_mode" "static"
    else
      # Deploy app files excluding VCS/deps
      rsync -a --exclude='.git' --exclude='node_modules' --exclude='.deploy-keys' --exclude='deploy_artifact' ./ "$ARTIFACT_DIR"/
      set_output "artifact_mode" "node"
    fi
    set_output "skip_deploy" "false"
    ;;
  laravel)
    # Composer on CI; public/ goes to webroot. Remainder synced to REPO_PATH by remote script.
    if command -v composer >/dev/null 2>&1; then
      composer install --no-dev --optimize-autoloader --no-interaction
    else
      log "composer not available on runner; remote step will install."
    fi
    if [[ -d public ]]; then
      copy_dir public
    else
      err "Laravel project missing public/ directory."
      exit 1
    fi
    set_output "artifact_mode" "laravel"
    set_output "skip_deploy" "false"
    ;;
  *)
    err "Unsupported framework: $FRAMEWORK"
    exit 1
    ;;
esac

# Always keep a deploy marker
printf '%s\n' "{\"framework\":\"$FRAMEWORK\",\"builtAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"sha\":\"${GITHUB_SHA:-local}\"}" > "$ARTIFACT_DIR/.deploy-meta.json"

file_count="$(find "$ARTIFACT_DIR" -type f | wc -l | tr -d ' ')"
log "Artifact file count: $file_count"
set_output "file_count" "$file_count"

if [[ "$file_count" -eq 0 ]]; then
  err "deploy_artifact is empty after build."
  exit 1
fi
