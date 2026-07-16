# Sync ASSET_VERSION into every HTML page (cache busting for CSS, JS, icons, brand images).
# Run from project root after changing css/site.css, js/site.js, or static assets:
#   powershell -File scripts/sync-asset-version.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

$versionFile = Join-Path $Root "ASSET_VERSION"
if (-not (Test-Path $versionFile)) {
    Write-Error "ASSET_VERSION file missing at $versionFile"
}
$version = (Get-Content $versionFile -Raw).Trim()
if (-not $version) {
    Write-Error "ASSET_VERSION is empty"
}

$htmlFiles = Get-ChildItem -Path $Root -Filter "*.html" -File
$count = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content

    $content = $content -replace 'href="css/site\.css(?:\?v=[^"]*)?"', "href=`"css/site.css?v=$version`""
    $content = $content -replace '<script src="js/site\.js(?:\?v=[^"]*)?"(?:\s+defer)?></script>', "<script src=`"js/site.js?v=$version`" defer></script>"
    $content = $content -replace 'href="assets/icons/favicon\.png(?:\?v=[^"]*)?"', "href=`"assets/icons/favicon.png?v=$version`""
    $content = $content -replace 'href="favicon\.ico(?:\?v=[^"]*)?"', "href=`"favicon.ico?v=$version`""
    $content = $content -replace 'src="assets/icons/hurfi-mark\.png(?:\?v=[^"]*)?"', "src=`"assets/icons/hurfi-mark.png?v=$version`""
    $content = $content -replace 'src="assets/icons/hurfi-mark\.svg(?:\?v=[^"]*)?"', "src=`"assets/icons/hurfi-mark.svg?v=$version`""
    $content = $content -replace 'src="assets/brands/([^"?]+)(?:\?v=[^"]*)?"', "src=`"assets/brands/`$1?v=$version`""
    $content = $content -replace 'src="portfolio-preview/([^"?]+)(?:\?v=[^"]*)?"', "src=`"portfolio-preview/`$1?v=$version`""
    $content = $content -replace 'data-src="portfolio-preview/([^"?]+)(?:\?v=[^"]*)?"', "data-src=`"portfolio-preview/`$1?v=$version`""

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
        $count++
    }
}

Write-Host "Synced asset version $version across $count HTML file(s)."
