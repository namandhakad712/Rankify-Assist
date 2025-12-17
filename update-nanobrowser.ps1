# Nanobrowser Update Script
# Updates official Nanobrowser while preserving Tuya integration

Write-Host "🔄 Starting Nanobrowser Update Process..." -ForegroundColor Cyan

# Step 1: Pull latest changes
Write-Host "`n📥 Pulling latest Nanobrowser from GitHub..." -ForegroundColor Yellow
Set-Location "c:\TUYA\nanobrowser"
git pull
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git pull failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependency installation failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Build
Write-Host "`n🔨 Building Nanobrowser..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Backup Tuya integration
Write-Host "`n💾 Backing up Tuya integration..." -ForegroundColor Yellow
$tuyaBackup = "c:\TUYA\RankifyAssist\.tuya-backup"
if (Test-Path "c:\TUYA\RankifyAssist\nanobrowser-working\extensions") {
    Copy-Item -Path "c:\TUYA\RankifyAssist\nanobrowser-working\extensions" -Destination $tuyaBackup -Recurse -Force
    Write-Host "   ✅ Tuya integration backed up" -ForegroundColor Green
}

# Step 5: Copy new build (excluding extensions)
Write-Host "`n📂 Copying new build..." -ForegroundColor Yellow
Get-ChildItem "c:\TUYA\nanobrowser\dist\*" | Where-Object { $_.Name -ne "extensions" } | Copy-Item -Destination "c:\TUYA\RankifyAssist\nanobrowser-working\" -Recurse -Force

# Step 6: Restore Tuya integration
Write-Host "`n♻️  Restoring Tuya integration..." -ForegroundColor Yellow
if (Test-Path $tuyaBackup) {
    Copy-Item -Path "$tuyaBackup\*" -Destination "c:\TUYA\RankifyAssist\nanobrowser-working\extensions\" -Recurse -Force
    Remove-Item $tuyaBackup -Recurse -Force
    Write-Host "   ✅ Tuya integration restored" -ForegroundColor Green
}

# Step 7: Re-add Tuya to manifest
Write-Host "`n📝 Updating manifest.json..." -ForegroundColor Yellow
$manifest = Get-Content "c:\TUYA\RankifyAssist\nanobrowser-working\manifest.json" | ConvertFrom-Json
$manifest.content_scripts[0].js = @(
    "extensions/tuya-integration/tuya-controller.js",
    $manifest.content_scripts[0].js[0]
)
$manifest | ConvertTo-Json -Depth 10 | Set-Content "c:\TUYA\RankifyAssist\nanobrowser-working\manifest.json"
Write-Host "   ✅ Manifest updated with Tuya integration" -ForegroundColor Green

# Done!
Write-Host "`n✅ Update complete!" -ForegroundColor Green
Write-Host "`n📍 Extension location: c:\TUYA\RankifyAssist\nanobrowser-working" -ForegroundColor Cyan
Write-Host "🔄 Reload the extension in Chrome: chrome://extensions/" -ForegroundColor Cyan
