# Требования:
# 1) PuTTY: pscp.exe и plink.exe в PATH (или пропишите пути ниже)
# 2) На сервере права на /var/www (пользователь = root, или sudo NOPASSWD)
# 3) Первый коннект: примите host key (или укажите отпечаток в $HostKey)

# ===================== КОНФИГ =====================
$Host = "51.250.16.76"
$Port = 22
$User = "astoliarov"            # если не root, оставьте sudo как есть
$Ppk  = "C:\Users\daewoosh\.ssh\safe-poker-gleb-dev.ppk" # приватный ключ PuTTY (PPK)
# Необязательно: фиксируем отпечаток ключа хоста (повышает безопасность)
# Пример: ssh-ed25519 255 SHA256:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
$HostKey = $null            # например: "ssh-ed25519 255 SHA256:abc..."

$ServerSrc  = "C:\Work Projects\poker\sp-front\dist\apps\sp-front\server"
$BrowserSrc = "C:\Work Projects\poker\sp-front\dist\apps\sp-front\browser"

$RemoteServer  = "/var/www/server"
$RemoteBrowser = "/var/www/browser"    

$SafeBase     = "/var/www/safe-poker"
$SafeServer   = "$SafeBase/server"
$SafeBrowser  = "$SafeBase/browser"

# Полные пути к pscp / plink (если не в PATH — пропишите явные пути)
$Pscp  = "pscp.exe"
$Plink = "plink.exe"

# ===================== ПРОВЕРКИ =====================
function Fail($msg){ Write-Error $msg; exit 1 }

if (!(Test-Path $ServerSrc))  { Fail "Нет каталога SERVER_SRC: $ServerSrc" }
if (!(Test-Path $BrowserSrc)) { Fail "Нет каталога BROWSER_SRC: $BrowserSrc" }
if (-not (Get-Command $Pscp  -ErrorAction SilentlyContinue)) { Fail "pscp.exe не найден. Установите PuTTY или пропишите путь в \$Pscp" }
if (-not (Get-Command $Plink -ErrorAction SilentlyContinue)) { Fail "plink.exe не найден. Установите PuTTY или пропишите путь в \$Plink" }
if (!(Test-Path $Ppk)) { Fail "Файл ключа не найден: $Ppk" }

# ===================== ПОДГОТОВКА TEMP для browser (без assets, media) =====================
$TempDir = Join-Path $env:TEMP "sp_browser_upload"
if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir }
New-Item -ItemType Directory -Path $TempDir | Out-Null

# Robocopy: копируем всё из browser, кроме каталогов assets и media
# /E — с подкаталогами; /XD — исключить каталоги
$rcLog = Join-Path $env:TEMP "robocopy_browser.log"
$robocopyArgs = @("$BrowserSrc", "$TempDir", "/E", "/XD", "assets", "media", "/NFL", "/NDL", "/NJH", "/NJS", "/NP")
$rob = Start-Process -FilePath robocopy.exe -ArgumentList $robocopyArgs -Wait -PassThru -NoNewWindow
if ($rob.ExitCode -ge 8) { Fail "Robocopy завершился с ошибкой (код $($rob.ExitCode))" }

# ===================== СОЗДАНИЕ КАТАЛОГОВ НА СЕРВЕРЕ =====================
$commonPlinkArgs = @("-batch", "-P", $Port, "-i", $Ppk)
if ($HostKey) { $commonPlinkArgs += @("-hostkey", $HostKey) }
$sshTarget = "$User@$Host"

& $Plink @commonPlinkArgs $sshTarget "sudo mkdir -p '$RemoteServer' '$RemoteBrowser' '$SafeServer' '$SafeBrowser'" || Fail "Не удалось создать каталоги на сервере"

# ===================== КОПИРОВАНИЕ server =====================
& $Pscp @("-batch", "-P", $Port, "-i", $Ppk, "-r", (Join-Path $ServerSrc "*"), "$sshTarget:$RemoteServer/") || Fail "Копирование server не удалось"

# ===================== КОПИРОВАНИЕ browser (без assets, media) =====================
& $Pscp @("-batch", "-P", $Port, "-i", $Ppk, "-r", (Join-Path $TempDir "*"), "$sshTarget:$RemoteBrowser/") || Fail "Копирование browser не удалось"

# ===================== СИНХРОНИЗАЦИЯ в /var/www/safe-poker =====================
$remoteScript = @"
set -e
mkdir -p "$SafeServer" "$SafeBrowser"
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$RemoteServer"/ "$SafeServer"/
  rsync -a --delete --exclude=assets/ --exclude=media/ "$RemoteBrowser"/ "$SafeBrowser"/
else
  # server: полная замена
  find "$SafeServer" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  cp -a "$RemoteServer"/. "$SafeServer"/
  # browser: удалить всё, КРОМЕ assets и media; затем скопировать всё из стейджа
  mkdir -p "$SafeBrowser"
  find "$SafeBrowser" -mindepth 1 -maxdepth 1 ! -name assets ! -name media -exec rm -rf {} +
  find "$RemoteBrowser" -mindepth 1 -maxdepth 1 ! -name assets ! -name media -exec cp -a -t "$SafeBrowser" {} +
fi
"@

# Передаём скрипт по stdin и запускаем под sudo bash
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $Plink
$psi.ArgumentList.AddRange($commonPlinkArgs)
$psi.ArgumentList.Add($sshTarget)
$psi.ArgumentList.Add("sudo bash -s")
$psi.RedirectStandardInput = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
$p = [System.Diagnostics.Process]::Start($psi)
$p.StandardInput.WriteLine($remoteScript)
$p.StandardInput.Close()
$p.WaitForExit()
if ($p.ExitCode -ne 0) { Fail "Синхронизация на сервере не удалась (код $($p.ExitCode))" }

Write-Host "Готово!" -ForegroundColor Green
