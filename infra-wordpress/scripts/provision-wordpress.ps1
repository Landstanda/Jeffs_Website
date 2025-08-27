Param(
  [string]$Region = "sjc",
  [string]$DbApp = "jeff-edgewise-wp-db",
  [string]$WpApp = "jeff-edgewise-wp",
  [string]$DbVolumeName = "data",
  [string]$DbVolumeSizeGb = "2",
  [string]$WpVolumeName = "uploads",
  [string]$WpVolumeSizeGb = "1",
  [string]$MysqlRootPassword = (New-Guid).Guid,
  [string]$MysqlDatabase = "wordpress",
  [string]$MysqlUser = "wpuser",
  [string]$MysqlPassword = (New-Guid).Guid
)

# Resolve flyctl
$fly = Get-Command flyctl -ErrorAction SilentlyContinue
if (-not $fly) {
  if ($env:FLY -and (Test-Path $env:FLY)) {
    $cmd = $env:FLY
  } else {
    $found = Get-ChildItem -Path "C:\Users\$env:USERNAME" -Recurse -Filter flyctl.exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($found) {
      $cmd = $found
    } else {
      Write-Error 'flyctl not found in PATH or user home. Install flyctl and try again.'
      exit 1
    }
  }
} else {
  $cmd = 'flyctl'
}

$DbConfig = Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'db/fly.toml'
$WpConfig = Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'wp/fly.toml'

Write-Host "Creating DB app $DbApp in region $Region..."
& $cmd apps create $DbApp -y | Out-Host
& $cmd volumes create $DbVolumeName --app $DbApp --region $Region --size $DbVolumeSizeGb -y | Out-Host

Write-Host "Setting DB secrets..."
& $cmd secrets set --app $DbApp MYSQL_ROOT_PASSWORD=$MysqlRootPassword MYSQL_DATABASE=$MysqlDatabase MYSQL_USER=$MysqlUser MYSQL_PASSWORD=$MysqlPassword -y | Out-Host

Write-Host "Launching MariaDB Machine..."
& $cmd launch --config $DbConfig --app $DbApp --image mariadb:11 --no-deploy -y | Out-Host
& $cmd deploy --config $DbConfig --app $DbApp -y | Out-Host

Write-Host "Creating WP app $WpApp in region $Region..."
& $cmd apps create $WpApp -y | Out-Host
& $cmd volumes create $WpVolumeName --app $WpApp --region $Region --size $WpVolumeSizeGb -y | Out-Host

Write-Host "Configuring WP env and secrets..."
$DbInternalHost = "$DbApp.internal"
& $cmd secrets set --app $WpApp WORDPRESS_DB_HOST=$DbInternalHost WORDPRESS_DB_USER=$MysqlUser WORDPRESS_DB_PASSWORD=$MysqlPassword WORDPRESS_DB_NAME=$MysqlDatabase -y | Out-Host

Write-Host "Launching WordPress Machine..."
& $cmd launch --config $WpConfig --app $WpApp --image wordpress:php8.2-apache --no-deploy -y | Out-Host
& $cmd deploy --config $WpConfig --app $WpApp -y | Out-Host

Write-Host "Done. Visit your WordPress app URL to complete setup:"
& $cmd status --app $WpApp | Out-Host

