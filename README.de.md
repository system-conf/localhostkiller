# Localhost Killer — Jeden Prozess auf einem localhost-Port mit einem Klick beenden (VS Code-Erweiterung + Desktop-App für Windows)

**Andere Sprachen:** [English](README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md)

> Schluss mit dem Kampf gegen `EADDRINUSE: address already in use`. Finde und beende jeden Prozess, der auf `localhost:3000`, `:5173`, `:8080` oder einem beliebigen anderen Port lauscht — mit einem Klick. Open Source, MIT-lizenziert, funktioniert ohne Administratorrechte.

[![Lizenz: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Plattform: Windows](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-blue)](#)
[![Mit TypeScript gebaut](https://img.shields.io/badge/TypeScript-5.5-3178c6)](#)
[![Electron](https://img.shields.io/badge/Electron-31-47848f)](#)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85%2B-007acc)](#)

**Localhost Killer** ist ein kostenloses Open-Source-Tool, das jeden TCP-Port auf deinem Windows-Rechner auflistet, der an `127.0.0.1`, `0.0.0.0`, `::1` oder `::` gebunden ist. Es zeigt dir, welcher Prozess jeden Port belegt (PID, Name der ausführbaren Datei, Befehlszeile) und lässt dich diese Prozesse einzeln oder alle auf einmal beenden — ohne jemals wieder `netstat -ano` und `taskkill /F /PID` anfassen zu müssen.

Aus **derselben Codebasis** entstehen zwei Varianten:

1. **VS Code-Erweiterung** — eine Seitenleisten-Ansicht und eine Statusleisten-Anzeige direkt in deinem Editor.
2. **Windows-Desktop-App** (Electron) — ein eigenständiges Fenster mit System-Tray-Symbol für Momente, in denen du nicht in VS Code arbeitest.

---

## Häufige Fehler, die dieses Tool behebt

Wenn du jemals einen dieser Fehler gesehen hast, wurde dieses Tool für dich gebaut:

```text
Error: listen EADDRINUSE: address already in use :::3000
Error: listen EADDRINUSE: address already in use 127.0.0.1:5173
Error: bind() to 0.0.0.0:8080 failed (10048: An attempt was made to access a socket...)
OSError: [Errno 98] Address already in use
java.net.BindException: Address already in use: bind
The process cannot access the file because it is being used by another process.
Failed to bind to address http://127.0.0.1:5000: address already in use.
Port 4200 is already in use. Use '--port' to specify a different port.
Something is already running on port 3000.
listen tcp 127.0.0.1:9090: bind: Only one usage of each socket address is normally permitted.
```

Häufige Übeltäter, die Localhost Killer erwischt:

| Stack | Standard-Port |
|-------|---------------|
| Create React App / Next.js / Express | `3000` |
| Vite / SvelteKit | `5173` |
| Vue CLI | `8080` |
| Angular CLI | `4200` |
| Flask / Django dev | `5000`, `8000` |
| Spring Boot | `8080` |
| ASP.NET Core | `5000`, `5001` |
| Rails | `3000` |
| Storybook | `6006` |
| Webpack Dev Server | `8080` |
| Metro (React Native) | `8081` |
| json-server | `3001` |
| Docker Desktop Port-Weiterleitungen | variabel |
| MongoDB / Postgres / Redis (lokale Entwicklung) | `27017` / `5432` / `6379` |

---

## Funktionen

- **Scannt jeden TCP-Listener** auf `127.0.0.1`, `0.0.0.0`, `::1`, `::` via `netstat -ano` und `Get-CimInstance Win32_Process` — keine externen Abhängigkeiten.
- **Beenden per Klick** pro Port oder **Kill All**, um alle Dev-Server auf einmal zu beenden.
- **Schutz für Systemprozesse**: PID 0/4 sowie `svchost.exe`, `lsass.exe`, `services.exe`, `wininit.exe`, `csrss.exe`, `smss.exe`, `winlogon.exe`, `spoolsv.exe`, `dwm.exe` werden als geschützt markiert und erfordern eine explizite Bestätigung.
- **Prozessbaum-Kill** (`taskkill /F /T`) bereinigt auch Kindprozesse und nicht nur den Elternprozess.
- **System-Tray-Unterstützung** in der Desktop-App: in den Tray minimieren, Rechtsklick für Kill All.
- **VS Code-Statusleisten-Anzeige** zeigt die aktuelle Anzahl der lauschenden localhost-Ports. Klick öffnet die Ansicht.
- **Automatische Aktualisierung** alle 5 Sekunden, in beiden Oberflächen umschaltbar.
- Klick auf einen Port öffnet `http://localhost:PORT` im Standardbrowser.
- Suche nach Port, PID, Prozessname oder Befehlszeile.
- **Dunkles und helles Theme** werden automatisch vom System erkannt.

---

## Schnellstart

### VS Code-Erweiterung installieren

```bash
git clone https://github.com/system-conf/localhostkiller.git
cd localhostkiller
npm install
npm run build:core
npm run package:vscode      # erzeugt packages/vscode-extension/*.vsix
code --install-extension packages/vscode-extension/localhostkiller-vscode-*.vsix
```

Oder als Entwicklungserweiterung laden: öffne `packages/vscode-extension/` in VS Code und drücke **F5**.

### Windows-Desktop-App installieren

```bash
git clone https://github.com/system-conf/localhostkiller.git
cd localhostkiller
npm install
npm run build:core
npm run package:app         # erzeugt packages/windows-app/release/*.exe
```

Es werden zwei Installer erzeugt:

- `Localhost Killer-X.Y.Z-x64.exe` — NSIS-Installer mit Startmenü- und Desktop-Verknüpfungen.
- `Localhost Killer-X.Y.Z-portable.exe` — eine einzelne portable EXE, keine Installation erforderlich.

> Die erste Version ist **unsigniert**. Windows SmartScreen zeigt "Der Computer wurde durch Windows geschützt" — klicke auf "Weitere Informationen" und dann "Trotzdem ausführen". Code-Signing folgt, sobald ein Zertifikat verfügbar ist.

---

## Funktionsweise

### Erkennung unter Windows

```
1. `netstat -ano -p TCP` ausführen und LISTENING-Zeilen parsen.
2. Lokale Adresse filtern auf 127.0.0.1, 0.0.0.0, ::1 oder ::.
3. PID-Metadaten in einem Batch über PowerShell abrufen:
     Get-CimInstance Win32_Process -Filter "ProcessId=X or ProcessId=Y ..."
4. PID auf { Name, CommandLine, ExecutablePath } abbilden.
5. Bekannte System-PIDs als geschützt markieren.
```

### Beenden

```
Windows:  taskkill /F /T /PID <pid>     # Baum-Kill (Eltern + Kinder)
Linux:    process.kill(pid, 'SIGKILL')
macOS:    process.kill(pid, 'SIGKILL')  # nutzt lsof zur Erkennung
```

Die gesamte Logik lebt in [`packages/core`](packages/core/src) und wird 1:1 zwischen der VS Code-Erweiterung und der Desktop-App geteilt.

---

## Architektur

Dies ist ein Monorepo mit **npm workspaces**:

```
localhostkiller/
├── packages/
│   ├── core/              # @localhostkiller/core — reiner TS-Scanner + Killer (keine UI-Abhängigkeiten)
│   ├── vscode-extension/  # VS Code-Erweiterung (TreeView + Befehle + Statusleiste)
│   └── windows-app/       # Electron + React Desktop-App + System-Tray
├── .github/workflows/     # CI (Build/Lint) + Release (automatische .vsix + .exe-Veröffentlichung)
└── LICENSE                # MIT
```

Das Paket `@localhostkiller/core` stellt drei asynchrone Funktionen bereit:

```typescript
import { scanLocalhost, killPid, killAll } from '@localhostkiller/core';

const processes = await scanLocalhost();
// [{ pid: 12345, port: 3000, name: 'node.exe', cmdline: 'node server.js', protected: false, ... }]

await killPid(12345);

const result = await killAll({ includeProtected: false });
// { killed: [12345, 67890], failed: [] }
```

Verwende es direkt aus jedem Node.js-Skript oder jeder Electron-App — es ist ein gewöhnliches npm-Paket.

---

## Vergleich mit Alternativen

| Tool | Plattform | Oberfläche | Baum-Kill | Schutz für Systemprozesse | Open Source |
|------|-----------|------------|-----------|--------------------------|-------------|
| **Localhost Killer** | Win/macOS/Linux | VS Code + Desktop | Ja | Ja | Ja (MIT) |
| `netstat -ano` + `taskkill` | Windows | Nur CLI | manuell | Nein | n/v |
| `kill-port` (npm) | plattformübergreifend | Nur CLI | teilweise | Nein | Ja |
| `npx fkill` | plattformübergreifend | CLI / interaktiv | Nein | Nein | Ja |
| TCPView (Sysinternals) | Windows | GUI | Nein | Nein | Nein (closed) |
| Ressourcenmonitor | Windows | GUI | Nein | Nein | Nein (eingebaut) |

---

## Entwicklung

```bash
npm install
npm run build:core              # zuerst das gemeinsame Core kompilieren

npm run dev:vscode              # esbuild --watch, F5 zum Starten
npm run dev:app                 # Vite + tsc --watch + Electron, UI-Hot-Reload
```

Projektaufbau, Skripte und der IPC-Vertrag zwischen Electron-Main und Renderer sind in der README des jeweiligen Pakets dokumentiert:

- [packages/core/](packages/core)
- [packages/vscode-extension/README.md](packages/vscode-extension/README.md)
- [packages/windows-app/README.md](packages/windows-app/README.md)

---

## Mitwirken

Pull Requests sind willkommen — siehe [CONTRIBUTING.md](CONTRIBUTING.md). Die gemeinsame Scanner- und Killer-Logik ist absichtlich winzig gehalten (~250 Zeilen), damit sie von vorn bis hinten gut lesbar ist. Die meisten Beiträge werden voraussichtlich in folgenden Bereichen landen:

- Bessere Extraktion von Prozess-Metadaten (CWD, Eltern-PID, Port-zu-URL-Erraten).
- macOS- und Linux-Oberflächen (der Core unterstützt sie bereits über `lsof` und `ss`).
- Ein CLI-Wrapper um `@localhostkiller/core` für Shell-Skripte.
- Bessere Filterung und Gruppierung in den Oberflächen.

---

## Häufig gestellte Fragen

**Werden Administratorrechte benötigt?** Nein. `taskkill /F` funktioniert für jeden Prozess, der dir gehört. Dienste auf Systemebene (die Administratorrechte erfordern) werden standardmäßig als geschützt gefiltert.

**Wird VS Code oder mein Browser beendet?** Nein. Das Standardverhalten listet nur Prozesse auf, die auf einem localhost-Port *lauschen*. Der Renderer von VS Code und dein Browser lauschen nicht — sie verbinden sich nach außen.

**Kann ich nur die Scanner-Bibliothek nutzen?** Ja. `npm i @localhostkiller/core` und `scanLocalhost()` aufrufen. Es liefert ein `LocalhostProcess[]` zurück.

**Warum nur TCP? Was ist mit UDP?** Dev-Server nutzen praktisch immer TCP. UDP-Unterstützung ist eine mögliche zukünftige Ergänzung — öffne ein Issue, falls du sie brauchst.

**Unterstützung für macOS oder Linux?** Der Core funktioniert dort (`lsof` und `ss`), und die **VS Code-Erweiterung läuft dort ohne Anpassung**, da sie reines Node.js ist. Die eigenständige Desktop-App ist aktuell als Build-Ziel nur für Windows konfiguriert — bearbeite `electron-builder.yml`, um `mac`- und `linux`-Ziele hinzuzufügen.

---

## Schlüsselwörter

`localhost-Port beenden` · `Prozess auf Port beenden Windows` · `taskkill Port` · `netstat Port beenden` · `EADDRINUSE beheben` · `Port bereits belegt` · `Adresse bereits in Verwendung` · `Node-Prozess beenden Windows` · `Dev-Server beenden` · `vscode Port-Killer Erweiterung` · `localhost Port Killer` · `Windows Port freigeben` · `welcher Prozess belegt Port` · `Windows Port-Verwaltung` · `Dev-Server-Killer` · `Port 3000 belegt` · `Port 5173 belegt` · `Vite Port-Killer` · `Next.js Port-Problem` · `React Dev-Server Port` · `npm run dev Port-Fehler`

---

## Lizenz

[MIT](./LICENSE) © 2026 Mitwirkende von localhostkiller

Wenn dir das Tool Zeit gespart hat, vergib einen Stern für das Repo — das hilft anderen, es zu finden.
