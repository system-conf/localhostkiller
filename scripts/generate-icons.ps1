# scripts/generate-icons.ps1
# Source: assets/icon-source.png  (square PNG, 512+ recommended, transparent background)
# Produces:
#   packages/vscode-extension/resources/icon.png   (128x128 - VS Code Marketplace)
#   packages/windows-app/resources/icon.png        (256x256)
#   packages/windows-app/resources/icon.ico        (multi-size: 16,24,32,48,64,128,256)
#   packages/windows-app/resources/tray.png        (32x32 - tray icon)
#   packages/windows-app/resources/tray@2x.png     (64x64 - hi-dpi tray)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root 'assets\icon-source.png'

if (-not (Test-Path $src)) {
    Write-Error "Source not found: $src"
    exit 1
}

Add-Type -AssemblyName System.Drawing

function Resize-Png {
    param([string]$Source, [string]$Target, [int]$Size)
    $img = [System.Drawing.Image]::FromFile($Source)
    try {
        $bmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        try {
            $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $g.Clear([System.Drawing.Color]::Transparent)
            $g.DrawImage($img, 0, 0, $Size, $Size)
        } finally { $g.Dispose() }
        $dir = Split-Path -Parent $Target
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
        $bmp.Save($Target, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        $dim = "${Size}px"
        Write-Host "  [ok] $Target  $dim"
    } finally { $img.Dispose() }
}

Write-Host "Generating PNGs..."
$targets = @(
    @{ path = 'packages\vscode-extension\resources\icon.png'; size = 128 },
    @{ path = 'packages\windows-app\resources\icon.png';      size = 256 },
    @{ path = 'packages\windows-app\resources\tray.png';      size = 32  },
    @{ path = 'packages\windows-app\resources\tray@2x.png';   size = 64  }
)
foreach ($t in $targets) {
    Resize-Png -Source $src -Target (Join-Path $root $t.path) -Size $t.size
}

Write-Host ""
Write-Host "Generating ICO (multi-size) via npx png-to-ico..."

$tmp = Join-Path $env:TEMP "lhk-ico-$(Get-Random)"
New-Item -ItemType Directory -Path $tmp | Out-Null
try {
    $sizes = 16, 24, 32, 48, 64, 128, 256
    $pngList = @()
    foreach ($s in $sizes) {
        $p = Join-Path $tmp "icon-$s.png"
        Resize-Png -Source $src -Target $p -Size $s
        $pngList += $p
    }
    $icoTarget = Join-Path $root 'packages\windows-app\resources\icon.ico'
    $icoDir = Split-Path -Parent $icoTarget
    if (-not (Test-Path $icoDir)) { New-Item -ItemType Directory -Path $icoDir | Out-Null }

    $quoted = ($pngList | ForEach-Object { '"' + $_ + '"' }) -join ' '
    $cmd = 'npx --yes png-to-ico ' + $quoted + ' > "' + $icoTarget + '"'
    cmd /c $cmd

    if ((Test-Path $icoTarget) -and ((Get-Item $icoTarget).Length -gt 0)) {
        Write-Host "  [ok] $icoTarget"
    } else {
        Write-Warning "ICO generation failed. Try manually: npx png-to-ico icon.png > icon.ico"
    }
} finally {
    Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Done. Outputs:"
$paths = @(
    (Join-Path $root 'packages\vscode-extension\resources\icon.png'),
    (Join-Path $root 'packages\windows-app\resources\icon.png'),
    (Join-Path $root 'packages\windows-app\resources\icon.ico'),
    (Join-Path $root 'packages\windows-app\resources\tray.png'),
    (Join-Path $root 'packages\windows-app\resources\tray@2x.png')
)
foreach ($p in $paths) {
    if (Test-Path $p) {
        $sz = [math]::Round((Get-Item $p).Length / 1KB, 1)
        Write-Host ("  {0,8} KB  {1}" -f $sz, $p)
    }
}
