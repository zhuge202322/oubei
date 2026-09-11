param([string]$OutputPath = 'dist/oubei-theme.zip')
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$themePath = Join-Path $repoRoot 'wordpress-theme/oubei'
Push-Location $themePath
npm run build
Pop-Location
$output = Join-Path $repoRoot $OutputPath
$outputDir = Split-Path -Parent $output
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$staging = Join-Path ([IO.Path]::GetTempPath()) ('oubei-theme-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path (Join-Path $staging 'oubei') | Out-Null
Get-ChildItem $themePath -Force | Where-Object { $_.Name -notin @('node_modules','tests','import','package.json','package-lock.json','postcss.config.mjs') } | Copy-Item -Destination (Join-Path $staging 'oubei') -Recurse -Force
if (Test-Path $output) { Remove-Item -LiteralPath $output -Force }
Compress-Archive -Path (Join-Path $staging 'oubei') -DestinationPath $output -Force
Remove-Item -LiteralPath $staging -Recurse -Force
Write-Output "Package created: $output"
