# One-time SEO + head metadata improvements across HTML pages.
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

$version = (Get-Content "ASSET_VERSION" -Raw).Trim()

$ogMap = @{
    "case-ghorsajan.html"     = "https://hurfi.com/portfolio-preview/ghorsajan.webp"
    "case-real-sign-bd.html"  = "https://hurfi.com/portfolio-preview/realsignbd.webp"
    "case-gully-apparel.html" = "https://hurfi.com/portfolio-preview/gullyapparel.webp"
    "case-gozero-print.html"  = "https://hurfi.com/portfolio-preview/gozeroprint.webp"
    "case-zaiax.html"         = "https://hurfi.com/portfolio-preview/zaiax.webp"
}

Get-ChildItem -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $original = $content

    if ($ogMap.ContainsKey($_.Name)) {
        $img = $ogMap[$_.Name]
        $content = $content.Replace("https://hurfi.com/assets/images/hurfi-logo-color.png", $img)
    }

    if ($content -notmatch "favicon\.ico") {
        $needle = '<link rel="apple-touch-icon"'
        $insert = '<link rel="icon" href="favicon.ico?v=' + $version + '" sizes="any" />' + "`r`n    " + $needle
        $content = $content.Replace($needle, $insert)
    }

    if ($content -notmatch 'http-equiv="Cache-Control"') {
        $content = $content.Replace(
            '<meta charset="UTF-8" />',
            '<meta charset="UTF-8" />' + "`r`n    " +
            '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />' + "`r`n    " +
            '<meta http-equiv="Pragma" content="no-cache" />' + "`r`n    " +
            '<meta http-equiv="Expires" content="0" />'
        )
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Updated $($_.Name)"
    }
}
