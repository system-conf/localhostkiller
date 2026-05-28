# Localhost Killer — VS Code Extension

Tüm `localhost` portlarını dinleyen süreçleri tek tıkla bul ve öldür. Hiçbir terminal komutu yok.

## Özellikler

- 🔍 Sidebar'da **Localhost Killer** sekmesi — dinlenen portları listeler (port, PID, süreç)
- ⚡ Her satırda tek tık **Kill** butonu
- 🔥 Toolbar'da **Kill All** — tüm localhost süreçlerini bir kerede öldürür
- 🛡️ Sistem süreçleri otomatik **korumalı** işaretlenir, kazara öldürmeyi engeller
- 📊 Status bar'da `🔥 N localhost` göstergesi — tıklayınca view açılır
- ⏱️ Opsiyonel oto-yenileme (varsayılan kapalı)
- 🌐 Sağ tık → **Open in Browser** ile portu hızlıca aç

## Ayarlar

| Anahtar | Varsayılan | Açıklama |
|---------|------------|----------|
| `localhostkiller.autoRefreshSeconds` | `0` | 0 = kapalı. Saniye cinsinden oto-yenileme. |
| `localhostkiller.confirmKillAll` | `true` | Kill All için onay modal'ı. |
| `localhostkiller.includeProtected` | `false` | Kill All sistem süreçlerini de dahil etsin mi? **Riskli.** |
| `localhostkiller.statusBar` | `true` | Durum çubuğu göstergesi. |

## Komutlar

- `Localhost Killer: Refresh`
- `Localhost Killer: Kill All`
- `Kill Process` (tree item context)
- `Open in Browser` (tree item context)
- `Copy PID` / `Copy Port` / `Copy Command Line`

## Nasıl Çalışır?

Windows'ta `netstat -ano` ile dinlenen portları toplar, `Get-CimInstance Win32_Process` ile sahip süreç bilgilerini alır, `taskkill /F /T /PID` ile süreç ağacını öldürür. macOS/Linux için `lsof`/`ss` fallback vardır.

## Lisans

[MIT](../../LICENSE)
