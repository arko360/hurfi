# Print local deploy secret values (gitignored keys)
# Usage: powershell -File scripts/print-github-secrets.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$keyDir = Join-Path $root ".deploy-keys"

function Require-File($path) {
  if (-not (Test-Path $path)) { throw "Missing: $path" }
}

Require-File (Join-Path $keyDir "github_actions_deploy")
Require-File (Join-Path $keyDir "known_hosts")

Write-Host "=== SSH_HOST ==="
Write-Host "141.136.43.105"
Write-Host "`n=== SSH_PORT ==="
Write-Host "65002"
Write-Host "`n=== SSH_USER ==="
Write-Host "u765323536"
Write-Host "`n=== DEPLOY_PATH ==="
Write-Host "/home/u765323536/domains/hurfi.com/public_html"
Write-Host "`n=== REPO_PATH ==="
Write-Host "/home/u765323536/domains/hurfi.com/repo"
Write-Host "`n=== SSH_PRIVATE_KEY (copy everything below) ==="
Get-Content (Join-Path $keyDir "github_actions_deploy") -Raw
Write-Host "`n=== SSH_KNOWN_HOSTS (copy everything below) ==="
Get-Content (Join-Path $keyDir "known_hosts") -Raw
Write-Host "`nDone. Add these as GitHub Actions repository secrets."
