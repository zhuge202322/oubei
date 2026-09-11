param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$TestFile
)

$ErrorActionPreference = 'Stop'
$sitePath = 'C:\xampp\htdocs\oubei-wordpress'
$testPath = Join-Path $sitePath ('wp-content\themes\oubei\tests\' + $TestFile)

if (-not (Test-Path -LiteralPath $testPath)) {
    throw "WordPress test file not found: $testPath"
}

$wp = Get-Command wp -ErrorAction SilentlyContinue
if ($null -eq $wp) {
    $wp = Get-Command 'C:\wp-cli\wp.bat' -ErrorAction SilentlyContinue
}
$wpPhp = 'C:\xampp\php\php.exe'
$wpPhar = 'C:\xampp\wp-cli.phar'
if ($null -ne $wp) {
    & $wp.Source --path=$sitePath eval-file $testPath
} elseif ((Test-Path -LiteralPath $wpPhp) -and (Test-Path -LiteralPath $wpPhar)) {
    & $wpPhp $wpPhar --path=$sitePath eval-file $testPath
} else {
    throw 'WP-CLI is required for WordPress integration tests.'
}
if ($LASTEXITCODE -ne 0) {
    throw "WordPress test failed with exit code $LASTEXITCODE."
}
