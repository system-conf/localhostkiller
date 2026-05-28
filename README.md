# Localhost Killer — Kill Any Process Using a localhost Port on Windows (VS Code Extension + Desktop App)

**Read this in:** [English](README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md)

> Stop fighting with `EADDRINUSE: address already in use`. Find and kill any process listening on `localhost:3000`, `:5173`, `:8080` — or any other port — with one click. Open-source, MIT-licensed, works without admin rights.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-blue)](#)
[![Built with TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6)](#)
[![Electron](https://img.shields.io/badge/Electron-31-47848f)](#)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85%2B-007acc)](#)

**Localhost Killer** is a free, open-source tool that lists every TCP port bound to `127.0.0.1`, `0.0.0.0`, `::1`, or `::` on your Windows machine, shows you which process owns each port (PID, executable name, command line), and lets you terminate them — individually or all at once — without ever touching `netstat -ano` and `taskkill /F /PID` again.

Ships in two flavors from the **same codebase**:

1. **VS Code Extension** — a sidebar view and status bar indicator inside your editor.
2. **Windows Desktop App** (Electron) — a standalone window with a system-tray icon for when you are not in VS Code.

---

## Common Errors This Tool Fixes

If you have ever seen any of these errors, this tool was built for you:

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

Common offenders Localhost Killer catches:

| Stack | Default Port |
|-------|--------------|
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
| Docker Desktop forwards | varies |
| MongoDB / Postgres / Redis (local dev) | `27017` / `5432` / `6379` |

---

## Features

- **Scans every TCP listener** on `127.0.0.1`, `0.0.0.0`, `::1`, `::` via `netstat -ano` and `Get-CimInstance Win32_Process` — no external dependencies.
- **One-click kill** per port, or **Kill All** to terminate every dev server at once.
- **System-process protection**: PID 0/4 and `svchost.exe`, `lsass.exe`, `services.exe`, `wininit.exe`, `csrss.exe`, `smss.exe`, `winlogon.exe`, `spoolsv.exe`, `dwm.exe` are flagged as protected and require explicit confirmation.
- **Process-tree kill** (`taskkill /F /T`) properly cleans up child workers, not just the parent.
- **System tray support** in the desktop app: minimize to tray, right-click for Kill All.
- **VS Code status bar** indicator shows the current count of listening localhost ports. Click it to open the view.
- **Auto-refresh** every 5 seconds, toggleable in both UIs.
- Click a port to open `http://localhost:PORT` in your default browser.
- Search by port, PID, process name, or command line.
- **Dark and light themes** auto-detected from the system.

---

## Quickstart

### Install the VS Code Extension

```bash
git clone https://github.com/system-conf/localhostkiller.git
cd localhostkiller
npm install
npm run build:core
npm run package:vscode      # produces packages/vscode-extension/*.vsix
code --install-extension packages/vscode-extension/localhostkiller-vscode-*.vsix
```

Or load it as a development extension: open `packages/vscode-extension/` in VS Code and press **F5**.

### Install the Windows Desktop App

```bash
git clone https://github.com/system-conf/localhostkiller.git
cd localhostkiller
npm install
npm run build:core
npm run package:app         # produces packages/windows-app/release/*.exe
```

Two installers are produced:

- `Localhost Killer-X.Y.Z-x64.exe` — NSIS installer with Start Menu and desktop shortcuts.
- `Localhost Killer-X.Y.Z-portable.exe` — a single portable EXE, no install required.

> The first release is **unsigned**. Windows SmartScreen will show "Windows protected your PC" — click "More info" then "Run anyway". Code-signing will land once a certificate is available.

---

## How It Works

### Detection on Windows

```
1. Run `netstat -ano -p TCP` and parse LISTENING rows.
2. Filter local address to 127.0.0.1, 0.0.0.0, ::1, or ::.
3. Batch-fetch PID metadata via PowerShell:
     Get-CimInstance Win32_Process -Filter "ProcessId=X or ProcessId=Y ..."
4. Map PID to { Name, CommandLine, ExecutablePath }.
5. Tag known system PIDs as protected.
```

### Kill

```
Windows:  taskkill /F /T /PID <pid>     # tree-kill (parent + children)
Linux:    process.kill(pid, 'SIGKILL')
macOS:    process.kill(pid, 'SIGKILL')  # uses lsof for detection
```

All logic lives in [`packages/core`](packages/core/src) and is shared 1:1 between the VS Code extension and the desktop app.

---

## Architecture

This is a monorepo using **npm workspaces**:

```
localhostkiller/
├── packages/
│   ├── core/              # @localhostkiller/core — pure TS scanner + killer (no UI deps)
│   ├── vscode-extension/  # VS Code extension (TreeView + commands + status bar)
│   └── windows-app/       # Electron + React desktop app + system tray
├── .github/workflows/     # CI (build/lint) + Release (auto-publish .vsix + .exe)
└── LICENSE                # MIT
```

The `@localhostkiller/core` package exposes three async functions:

```typescript
import { scanLocalhost, killPid, killAll } from '@localhostkiller/core';

const processes = await scanLocalhost();
// [{ pid: 12345, port: 3000, name: 'node.exe', cmdline: 'node server.js', protected: false, ... }]

await killPid(12345);

const result = await killAll({ includeProtected: false });
// { killed: [12345, 67890], failed: [] }
```

Use it directly from any Node.js script or Electron app — it is a regular npm package.

---

## Comparison with Alternatives

| Tool | Platform | UI | Tree-kill | System-process guard | Open Source |
|------|----------|-----|-----------|---------------------|-------------|
| **Localhost Killer** | Win/macOS/Linux | VS Code + Desktop | Yes | Yes | Yes (MIT) |
| `netstat -ano` + `taskkill` | Windows | CLI only | manual | No | n/a |
| `kill-port` (npm) | cross-platform | CLI only | partial | No | Yes |
| `npx fkill` | cross-platform | CLI / interactive | No | No | Yes |
| TCPView (Sysinternals) | Windows | GUI | No | No | No (closed) |
| Resource Monitor | Windows | GUI | No | No | No (built-in) |

---

## Development

```bash
npm install
npm run build:core              # compile shared core first

npm run dev:vscode              # esbuild --watch, press F5 to launch
npm run dev:app                 # Vite + tsc --watch + Electron, hot reload UI
```

Project layout, scripts, and the IPC contract between the Electron main and renderer are documented in each package's README:

- [packages/core/](packages/core)
- [packages/vscode-extension/README.md](packages/vscode-extension/README.md)
- [packages/windows-app/README.md](packages/windows-app/README.md)

---

## Contributing

Pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). The shared scanner and killer logic is intentionally tiny (~250 lines) so it is easy to read end-to-end. Most contributions are likely to land in:

- Better process-metadata extraction (CWD, parent PID, port to URL guess).
- macOS and Linux UIs (the core already supports them via `lsof` and `ss`).
- A CLI wrapper around `@localhostkiller/core` for shell scripts.
- Better filtering and grouping in the UIs.

---

## FAQ

**Does this need admin rights?** No. `taskkill /F` works on any process you own. System-level services (which require admin) are filtered as protected by default.

**Will it kill VS Code or my browser?** No. The default behavior only lists processes that are *listening* on a localhost port. VS Code's renderer and your browser are not listening — they are connecting outward.

**Can I use just the scanner library?** Yes. `npm i @localhostkiller/core` and call `scanLocalhost()`. It returns a `LocalhostProcess[]`.

**Why TCP only? What about UDP?** Dev servers are virtually always TCP. UDP support is a possible future addition — open an issue if you need it.

**macOS or Linux support?** The core works (`lsof` and `ss`), and the **VS Code extension also works there** with zero changes since it is pure Node. The standalone desktop app is currently Windows-only by build target — flip `electron-builder.yml` to add `mac` and `linux` targets if you want it.

---

## Keywords

`kill localhost port` · `kill process on port windows` · `taskkill port` · `netstat kill port` · `EADDRINUSE` · `address already in use` · `port already in use` · `kill node process windows` · `kill dev server` · `vscode kill port extension` · `localhost port killer` · `free port windows` · `find process using port` · `windows port management` · `dev server killer` · `port 3000 in use` · `port 5173 in use` · `vite port killer` · `next.js port` · `react dev server port` · `npm run dev port` · `EADDRINUSE windows fix`

---

## License

[MIT](./LICENSE) © 2026 localhostkiller contributors

If this saved you time, star the repo — it helps others find it.
