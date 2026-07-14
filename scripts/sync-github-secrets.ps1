# Sync local deploy keys → GitHub Actions secrets (permanent helper)
# Usage:
#   1) One-time:  gh auth login
#   2) Anytime:   powershell -File scripts/sync-github-secrets.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$keyDir = Join-Path $root ".deploy-keys"
$gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
  $ghCmd = Get-Command gh -ErrorAction SilentlyContinue
  if (-not $ghCmd) { throw "GitHub CLI (gh) not found. Install: winget install GitHub.cli" }
  $gh = $ghCmd.Source
}

function Require-File([string]$path) {
  if (-not (Test-Path $path)) { throw "Missing file: $path" }
}

Require-File (Join-Path $keyDir "github_actions_deploy")
Require-File (Join-Path $keyDir "known_hosts")

Push-Location $root
try {
  & $gh auth status 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in. Starting GitHub login (browser)..."
    & $gh auth login --hostname github.com --git-protocol https --web
    if ($LASTEXITCODE -ne 0) { throw "gh auth login failed" }
  }

  $repo = "arko360/hurfi"
  Write-Host "Syncing secrets to $repo ..."

  # Plain values
  "141.136.43.105" | & $gh secret set SSH_HOST --repo $repo
  "65002" | & $gh secret set SSH_PORT --repo $repo
  "u765323536" | & $gh secret set SSH_USER --repo $repo
  "/home/u765323536/domains/hurfi.com/public_html" | & $gh secret set DEPLOY_PATH --repo $repo
  "/home/u765323536/domains/hurfi.com/repo" | & $gh secret set REPO_PATH --repo $repo

  # Key material from files (no manual paste / no CRLF issues)
  & $gh secret set SSH_PRIVATE_KEY --repo $repo --body (Get-Content (Join-Path $keyDir "github_actions_deploy") -Raw)
  & $gh secret set SSH_KNOWN_HOSTS --repo $repo --body (Get-Content (Join-Path $keyDir "known_hosts") -Raw)

  $fp = & ssh-keygen -lf (Join-Path $keyDir "github_actions_deploy")
  Write-Host ""
  Write-Host "All secrets synced."
  Write-Host "Expected deploy key fingerprint:"
  Write-Host "  $fp"
  Write-Host ""
  Write-Host "Check in Actions log for the same fingerprint under 'Prepare SSH key'."
}
finally {
  Pop-Location
}
