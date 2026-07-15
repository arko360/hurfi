#!/usr/bin/env bash
# Packages the static HTML site into ./deploy_artifact (no Node required)
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

if [[ ! -f index.html ]]; then
  err "index.html missing — nothing to deploy."
  exit 1
fi

log "Detected framework: static"
set_output "framework" "static"

shopt -s nullglob dotglob
for item in \
  index.html \
  *.html \
  .htaccess \
  robots.txt \
  sitemap.xml \
  favicon.ico \
  css \
  js \
  assets \
  portfolio-preview \
  portfolio \
  images \
  img \
  fonts \
  media; do
  if [[ -e "$item" ]]; then
    cp -a "$item" "$ARTIFACT_DIR"/
  fi
done
shopt -u nullglob dotglob

# Avoid shipping helper docs into public_html
rm -f "$ARTIFACT_DIR/README.md" 2>/dev/null || true

set_output "artifact_mode" "static"
set_output "skip_deploy" "false"

printf '%s\n' "{\"framework\":\"static\",\"builtAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"sha\":\"${GITHUB_SHA:-local}\"}" > "$ARTIFACT_DIR/.deploy-meta.json"

file_count="$(find "$ARTIFACT_DIR" -type f | wc -l | tr -d ' ')"
log "Artifact file count: $file_count"
set_output "file_count" "$file_count"

if [[ "$file_count" -eq 0 ]]; then
  err "deploy_artifact is empty."
  exit 1
fi
