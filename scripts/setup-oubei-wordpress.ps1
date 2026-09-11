param(
    [string]$SitePath = 'C:\xampp\htdocs\oubei-wordpress',
    [string]$SiteUrl = 'http://localhost:6911',
    [string]$DbName = 'oubei_wordpress',
    [string]$DbUser = 'root',
    [string]$DbPassword = '',
    [string]$AdminUser = 'admin',
    [string]$AdminPassword = 'oubei-local-admin-2026',
    [string]$AdminEmail = 'admin@example.com'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$themeSource = Join-Path $repoRoot 'wordpress-theme\oubei'
$php = 'C:\xampp\php\php.exe'
$mysql = 'C:\xampp\mysql\bin\mysql.exe'
$wpPhar = 'C:\xampp\wp-cli.phar'
$apacheConf = 'C:\xampp\apache\conf\httpd.conf'
$vhostsConf = 'C:\xampp\apache\conf\extra\httpd-vhosts.conf'

if (-not (Test-Path -LiteralPath $php)) { throw "XAMPP PHP not found: $php" }
if (-not (Test-Path -LiteralPath $mysql)) { throw "XAMPP MariaDB client not found: $mysql" }
if ($DbName -notmatch '^[A-Za-z0-9_]+$') { throw 'Database name may contain only letters, digits, and underscores.' }

if (-not (Test-Path -LiteralPath $wpPhar)) {
    Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar' -OutFile $wpPhar
}

if (-not (Test-Path -LiteralPath (Join-Path $SitePath 'wp-admin'))) {
    $tempZip = Join-Path ([IO.Path]::GetTempPath()) 'wordpress-latest.zip'
    Invoke-WebRequest -Uri 'https://wordpress.org/latest.zip' -OutFile $tempZip
    $tempExtract = Join-Path ([IO.Path]::GetTempPath()) ('oubei-wp-' + [guid]::NewGuid().ToString('N'))
    Expand-Archive -LiteralPath $tempZip -DestinationPath $tempExtract -Force
    New-Item -ItemType Directory -Force -Path $SitePath | Out-Null
    Copy-Item -Path (Join-Path $tempExtract 'wordpress\*') -Destination $SitePath -Recurse -Force
    Remove-Item -LiteralPath $tempZip,$tempExtract -Recurse -Force
}

$createDbArgs = @('-u', $DbUser)
if ($DbPassword) { $createDbArgs += @("-p$DbPassword") }
$createDbArgs += @('-e', "CREATE DATABASE IF NOT EXISTS $DbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
& $mysql @createDbArgs
if ($LASTEXITCODE -ne 0) { throw 'Unable to create the dedicated MariaDB database.' }

if (-not (Test-Path -LiteralPath (Join-Path $SitePath 'wp-config.php'))) {
    & $php $wpPhar config create --path=$SitePath --dbname=$DbName --dbuser=$DbUser --dbpass=$DbPassword --dbhost=127.0.0.1 --skip-check --force
    if ($LASTEXITCODE -ne 0) { throw 'WP-CLI could not create wp-config.php.' }
}

& $php $wpPhar core is-installed --path=$SitePath
if ($LASTEXITCODE -ne 0) {
    & $php $wpPhar core install --path=$SitePath --url=$SiteUrl --title='Xingtai Oubei' --admin_user=$AdminUser --admin_password=$AdminPassword --admin_email=$AdminEmail --skip-email
    if ($LASTEXITCODE -ne 0) { throw 'WP-CLI could not install WordPress.' }
}

& $php $wpPhar option update permalink_structure '/blog/%postname%/' --path=$SitePath
& $php $wpPhar rewrite structure '/blog/%postname%/' --path=$SitePath --hard

$htaccess = Join-Path $SitePath '.htaccess'
if (-not (Test-Path -LiteralPath $htaccess)) {
    @'
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
'@ | Set-Content -LiteralPath $htaccess -Encoding ASCII
}

$themeTarget = Join-Path $SitePath 'wp-content\themes\oubei'
if (Test-Path -LiteralPath $themeTarget) { Remove-Item -LiteralPath $themeTarget -Recurse -Force }
New-Item -ItemType Junction -Path $themeTarget -Target $themeSource | Out-Null
& $php $wpPhar theme activate oubei --path=$SitePath
if ($LASTEXITCODE -ne 0) { throw 'Oubei theme could not be activated.' }

$marker = '# OUBEI_LOCAL_6911'
$httpd = Get-Content -Raw -LiteralPath $apacheConf
if ($httpd -notmatch [regex]::Escape($marker)) {
    Copy-Item -LiteralPath $apacheConf -Destination "$apacheConf.oubei-backup-$(Get-Date -Format yyyyMMddHHmmss)" -Force
    Copy-Item -LiteralPath $vhostsConf -Destination "$vhostsConf.oubei-backup-$(Get-Date -Format yyyyMMddHHmmss)" -Force
    Add-Content -LiteralPath $apacheConf -Value "`r`n$marker`r`nListen 6911`r`n"
    Add-Content -LiteralPath $vhostsConf -Value "`r`n$marker`r`n<VirtualHost *:6911>`r`n    DocumentRoot `"$SitePath`"`r`n    <Directory `"$SitePath`">`r`n        AllowOverride All`r`n        Require all granted`r`n    </Directory>`r`n    ServerName localhost`r`n</VirtualHost>`r`n"
}

Write-Output "Oubei WordPress ready: $SiteUrl"
Write-Output "Admin user: $AdminUser"
Write-Output "Admin password: $AdminPassword"
Write-Output "Theme source: $themeSource"
