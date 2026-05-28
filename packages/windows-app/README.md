# Localhost Killer — Windows Desktop App

Find and kill any process listening on a `localhost` port with one click. A standalone desktop app — VS Code not required.

**Repository:** https://github.com/system-conf/localhostkiller · **Other languages:** [Türkçe](#turkce) · [Deutsch](#deutsch)

## Features

- A list view showing port, PID, process name and command line.
- A per-row **Kill** action and a large **Kill All** button.
- System processes are tagged with a **protected** badge and require extra confirmation before being killed.
- Search by port, PID, process name or command line.
- Auto-refresh every 5 seconds (toggleable).
- **System tray** support: the app stays in the background; right-click for "Kill All Localhost".
- Click a port number to open it in the default browser.

## Development

```bash
# from the repository root
npm install
npm run build:core
npm run dev:app
```

`dev:app` runs Vite (renderer) + tsc (main) + Electron together with hot reload.

## Packaging

```bash
npm run package:app
```

Output: `packages/windows-app/release/`

- `Localhost Killer-0.1.0-x64.exe` (NSIS installer)
- `Localhost Killer-0.1.0-portable.exe` (portable)

> The first release is unsigned. Windows SmartScreen will warn — choose "More info" then "Run anyway". This goes away once a code-signing certificate is in place.

## Architecture

- **Main process** (`src/main/`): window lifecycle, IPC handlers, tray.
- **Preload** (`src/preload/`): exposes a minimal `window.lhk` API via `contextBridge`.
- **Renderer** (`src/renderer/`): React UI.
- **Core** (`@localhostkiller/core`): the actual scan and kill logic (Windows: `netstat` + `taskkill`).

---

<a id="turkce"></a>
## Türkçe

`localhost` portunu dinleyen tüm süreçleri tek tıkla bul ve öldür. Bağımsız masaüstü uygulaması — VS Code gerekmez.

- Liste görünümü: port, PID, süreç adı, komut satırı.
- Per-row **Kill** + büyük **Kill All** butonu.
- Sistem süreçleri **protected** badge ile işaretli, kill için ekstra onay.
- Arama: port, PID, süreç adı, cmdline.
- 5 sn otomatik yenileme (kapatılabilir).
- **Sistem tepsisi**: arkaplanda kalır, sağ tık → "Kill All Localhost".
- Port numarasına tıkla → tarayıcıda aç.

Geliştirme ve paketleme komutları yukarıdakiyle aynıdır.

---

<a id="deutsch"></a>
## Deutsch

Finde und beende jeden Prozess, der einen `localhost`-Port belegt — mit einem Klick. Eine eigenständige Desktop-App, VS Code ist nicht erforderlich.

- Listenansicht mit Port, PID, Prozessname und Befehlszeile.
- Eine **Kill**-Aktion pro Zeile und eine große **Kill All**-Schaltfläche.
- Systemprozesse sind mit einem **protected**-Badge markiert und erfordern eine zusätzliche Bestätigung.
- Suche nach Port, PID, Prozessname oder Befehlszeile.
- Automatische Aktualisierung alle 5 Sekunden (umschaltbar).
- **System-Tray**-Unterstützung: die App läuft im Hintergrund weiter; Rechtsklick für "Kill All Localhost".
- Klick auf eine Portnummer öffnet sie im Standardbrowser.

Entwicklungs- und Paketierungsbefehle entsprechen denen oben.

---

## License

[MIT](../../LICENSE)
