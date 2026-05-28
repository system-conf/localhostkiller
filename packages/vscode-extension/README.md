# Localhost Killer — VS Code Extension

Find and kill any process listening on a `localhost` port with one click — without leaving the editor or touching the terminal.

**Repository:** https://github.com/system-conf/localhostkiller · **Other languages:** [Türkçe](#turkce) · [Deutsch](#deutsch)

## Features

- A **Localhost Killer** sidebar view that lists every listening port with port number, PID and process name.
- A one-click **Kill** action per row.
- A **Kill All** action in the view's toolbar that terminates every localhost server at once.
- **System processes** (`svchost.exe`, `lsass.exe`, ...) are auto-tagged as protected and require explicit confirmation.
- A status bar indicator showing the count of currently listening localhost ports; click it to open the view.
- Optional auto-refresh (off by default).
- Right-click `Open in Browser` to launch `http://localhost:PORT` in the default browser.

## Settings

| Key | Default | Description |
|-----|---------|-------------|
| `localhostkiller.autoRefreshSeconds` | `0` | `0` disables auto-refresh. Otherwise, refresh interval in seconds. |
| `localhostkiller.confirmKillAll` | `true` | Show a confirmation modal before Kill All. |
| `localhostkiller.includeProtected` | `false` | Include system processes in Kill All. **Risky.** |
| `localhostkiller.statusBar` | `true` | Show the listening-port count in the status bar. |

## Commands

- `Localhost Killer: Refresh`
- `Localhost Killer: Kill All`
- `Kill Process` (tree item context)
- `Open in Browser` (tree item context)
- `Copy PID` / `Copy Port` / `Copy Command Line`

## How It Works

On Windows the extension runs `netstat -ano` to collect listening ports, batches `Get-CimInstance Win32_Process` to fetch process metadata for each owning PID, and runs `taskkill /F /T /PID` to terminate the process tree. On macOS and Linux it falls back to `lsof` and `ss`.

---

<a id="turkce"></a>
## Türkçe

`localhost` portunu dinleyen tüm süreçleri tek tıkla bul ve öldür — editörden çıkmadan, terminal komutu yazmadan.

- Sidebar'da **Localhost Killer** sekmesi dinlenen portları listeler (port, PID, süreç adı).
- Her satırda tek tık **Kill** butonu.
- Toolbar'da **Kill All** — tüm localhost süreçlerini bir kerede öldürür.
- Sistem süreçleri otomatik **korumalı** işaretlenir, kazara öldürmeyi engeller.
- Durum çubuğunda dinlenen localhost port sayısı görünür — tıklayınca görünüm açılır.
- Opsiyonel otomatik yenileme (varsayılan kapalı).
- Sağ tık `Open in Browser` ile `http://localhost:PORT` varsayılan tarayıcıda açılır.

Tüm ayarlar yukarıdaki tablodaki anahtarlarla aynıdır.

---

<a id="deutsch"></a>
## Deutsch

Finde und beende jeden Prozess, der einen `localhost`-Port belegt — mit einem Klick, ohne den Editor zu verlassen oder ein Terminal zu öffnen.

- Eine **Localhost Killer**-Seitenleisten-Ansicht listet jeden lauschenden Port mit Portnummer, PID und Prozessname.
- **Beenden mit einem Klick** pro Zeile.
- **Kill All** in der Werkzeugleiste der Ansicht beendet alle localhost-Server auf einmal.
- **Systemprozesse** werden automatisch als geschützt markiert und erfordern eine ausdrückliche Bestätigung.
- Die Statusleisten-Anzeige zeigt die aktuelle Anzahl lauschender localhost-Ports; ein Klick öffnet die Ansicht.
- Optionale automatische Aktualisierung (standardmäßig aus).
- Rechtsklick `Open in Browser` öffnet `http://localhost:PORT` im Standardbrowser.

Alle Einstellungen entsprechen den Schlüsseln in der Tabelle oben.

---

## License

[MIT](../../LICENSE)
