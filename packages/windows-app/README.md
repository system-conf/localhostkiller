# Localhost Killer — Windows App

Tüm `localhost` portlarını dinleyen süreçleri tek tıkla bul ve öldür. Bağımsız masaüstü uygulaması, VS Code'a ihtiyacın yok.

## Özellikler

- 🔍 Liste görünümü: port, PID, süreç adı, komut satırı
- ⚡ Per-row **Kill** + büyük **Kill All** butonu
- 🛡️ Sistem süreçleri **protected** badge ile işaretli, kill için ekstra onay
- 🔎 Arama: port, PID, süreç adı, cmdline
- ⏱️ Auto-refresh (5 sn, kapatılabilir)
- 🪟 Sistem tepsisi: arkaplanda kalır, sağ tık → "Kill All Localhost"
- 🌐 Port numarasına tıkla → tarayıcıda aç

## Geliştirme

```bash
# Root'tan
npm install
npm run build:core
npm run dev:app
```

`dev:app` Vite (renderer) + tsc (main) + Electron'u birlikte başlatır.

## Paketleme

```bash
npm run package:app
```

Çıktı: `packages/windows-app/release/`
- `Localhost Killer-0.1.0-x64.exe` (NSIS installer)
- `Localhost Killer-0.1.0-portable.exe` (portable)

> İlk sürüm imzasız. Windows SmartScreen "More info → Run anyway" uyarısı verecek. Code-signing sertifikası eklendiğinde bu kaldırılacak.

## Mimari

- **Main process** (`src/main/`): pencere yönetimi, IPC handler'lar, tray
- **Preload** (`src/preload/`): `contextBridge` ile `window.lhk` API expose
- **Renderer** (`src/renderer/`): React UI
- **Core** (`@localhostkiller/core`): tarama + öldürme mantığı (Windows: netstat + taskkill)

## Lisans

[MIT](../../LICENSE)
