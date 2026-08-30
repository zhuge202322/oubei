param([string]$DataDir = $env:OUBEI_DATA_DIR, [string]$Destination = "C:\Backups\oubei")
if ([string]::IsNullOrWhiteSpace($DataDir)) { $DataDir = "C:\ProgramData\oubei" }
$stamp = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ")
$target = Join-Path $Destination $stamp
New-Item -ItemType Directory -Force -Path (Join-Path $target "media") | Out-Null
Copy-Item -LiteralPath (Join-Path $DataDir "site.db") -Destination (Join-Path $target "site.db") -Force
if (Test-Path (Join-Path $DataDir "media")) { Copy-Item -Path (Join-Path $DataDir "media\*") -Destination (Join-Path $target "media") -Recurse -Force }
Write-Output $target
