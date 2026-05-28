# Localhost Killer — Windows'ta localhost Portunu İşgal Eden Tüm Süreçleri Tek Tıkla Öldür (VS Code Eklentisi + Masaüstü Uygulaması)

**Diğer diller:** [English](README.md) · [Türkçe](README.tr.md) · [Deutsch](README.de.md)

> `EADDRINUSE: address already in use` hatasıyla mücadele etmeyi bırak. `localhost:3000`, `:5173`, `:8080` ya da herhangi bir portu dinleyen süreci tek tıkla bul ve öldür. Açık kaynak, MIT lisanslı, yönetici izni gerektirmez.

[![Lisans: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-blue)](#)
[![TypeScript ile yazıldı](https://img.shields.io/badge/TypeScript-5.5-3178c6)](#)
[![Electron](https://img.shields.io/badge/Electron-31-47848f)](#)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.85%2B-007acc)](#)

**Localhost Killer**, Windows makinende `127.0.0.1`, `0.0.0.0`, `::1` veya `::` üzerinde bağlı her TCP portunu listeleyen, her portu hangi sürecin tuttuğunu (PID, çalıştırılabilir dosya adı, komut satırı) gösteren ve bu süreçleri tek tek veya hepsini birden sonlandırmana izin veren ücretsiz, açık kaynak bir araçtır. Bir daha asla `netstat -ano` ve `taskkill /F /PID` komutlarına dokunmak zorunda kalmazsın.

**Aynı kod tabanından** iki ürün çıkar:

1. **VS Code Eklentisi** — editörün içinde kenar çubuğu görünümü ve durum çubuğu göstergesi.
2. **Windows Masaüstü Uygulaması** (Electron) — VS Code'da olmadığın zamanlar için sistem tepsisi destekli bağımsız bir pencere.

---

## Bu Araç Hangi Hataları Çözer?

Şu hatalardan herhangi birini gördüysen, bu araç tam olarak senin için yapıldı:

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

Localhost Killer'ın yakaladığı yaygın suçlular:

| Yığın | Varsayılan Port |
|-------|-----------------|
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
| Docker Desktop port yönlendirmeleri | değişken |
| MongoDB / Postgres / Redis (lokal geliştirme) | `27017` / `5432` / `6379` |

---

## Özellikler

- `127.0.0.1`, `0.0.0.0`, `::1`, `::` üzerindeki **tüm TCP dinleyicilerini** `netstat -ano` ve `Get-CimInstance Win32_Process` ile **tarar** — harici bağımlılık yok.
- Port başına **tek tıkla öldür** veya tüm dev sunucularını aynı anda kapatmak için **Kill All**.
- **Sistem süreç koruması**: PID 0/4 ve `svchost.exe`, `lsass.exe`, `services.exe`, `wininit.exe`, `csrss.exe`, `smss.exe`, `winlogon.exe`, `spoolsv.exe`, `dwm.exe` korumalı olarak işaretlenir ve öldürmek için açık onay ister.
- **Süreç ağacı öldürme** (`taskkill /F /T`) — yalnızca ebeveyni değil, alt işçi süreçleri de düzgün şekilde temizler.
- Masaüstü uygulamasında **sistem tepsisi desteği**: tepsiye küçült, sağ tıkla Kill All.
- **VS Code durum çubuğu göstergesi**: dinlenen localhost port sayısını gösterir. Üzerine tıkla, görünüm açılır.
- Her iki UI'da da **otomatik yenileme** (5 saniye, kapatılabilir).
- Bir porta tıkla, varsayılan tarayıcıda `http://localhost:PORT` açılır.
- Port, PID, süreç adı veya komut satırına göre **ara**.
- Sistem ayarından **otomatik koyu/açık tema** algılama.

---

## Hızlı Başlangıç

### VS Code Eklentisini Kur

```bash
git clone https://github.com/system-conf/localhostkiller.git
cd localhostkiller
npm install
npm run build:core
npm run package:vscode      # packages/vscode-extension/*.vsix üretir
code --install-extension packages/vscode-extension/localhostkiller-vscode-*.vsix
```

Veya geliştirme eklentisi olarak yükle: `packages/vscode-extension/` klasörünü VS Code'da aç ve **F5**'e bas.

### Windows Masaüstü Uygulamasını Kur

```bash
git clone https://github.com/system-conf/localhostkiller.git
cd localhostkiller
npm install
npm run build:core
npm run package:app         # packages/windows-app/release/*.exe üretir
```

İki kurulum dosyası üretilir:

- `Localhost Killer-X.Y.Z-x64.exe` — Başlat Menüsü ve masaüstü kısayolları olan NSIS kurulum.
- `Localhost Killer-X.Y.Z-portable.exe` — tek dosyalık taşınabilir EXE, kurulum gerektirmez.

> İlk sürüm **imzasız**. Windows SmartScreen "Windows protected your PC" uyarısı gösterecek — "More info" sonra "Run anyway" tıkla. Sertifika alındığında kod imzalama eklenecek.

---

## Nasıl Çalışır?

### Windows Üzerinde Tespit

```
1. `netstat -ano -p TCP` çalıştır ve LISTENING satırlarını ayrıştır.
2. Yerel adresi 127.0.0.1, 0.0.0.0, ::1 veya :: olarak filtrele.
3. PowerShell ile toplu PID metadata getir:
     Get-CimInstance Win32_Process -Filter "ProcessId=X or ProcessId=Y ..."
4. PID'yi { Name, CommandLine, ExecutablePath } ile eşle.
5. Bilinen sistem PID'lerini korumalı olarak işaretle.
```

### Öldürme

```
Windows:  taskkill /F /T /PID <pid>     # ağaç-öldürme (ebeveyn + çocuklar)
Linux:    process.kill(pid, 'SIGKILL')
macOS:    process.kill(pid, 'SIGKILL')  # tespit için lsof kullanır
```

Tüm mantık [`packages/core`](packages/core/src) içinde yaşar ve VS Code eklentisi ile masaüstü uygulaması arasında 1:1 paylaşılır.

---

## Mimari

Bu, **npm workspaces** kullanan bir monorepo'dur:

```
localhostkiller/
├── packages/
│   ├── core/              # @localhostkiller/core — saf TS tarayıcı + öldürücü (UI bağımlılığı yok)
│   ├── vscode-extension/  # VS Code eklentisi (TreeView + komutlar + durum çubuğu)
│   └── windows-app/       # Electron + React masaüstü uygulaması + sistem tepsisi
├── .github/workflows/     # CI (build/lint) + Release (otomatik .vsix + .exe yayımı)
└── LICENSE                # MIT
```

`@localhostkiller/core` paketi üç async fonksiyon sunar:

```typescript
import { scanLocalhost, killPid, killAll } from '@localhostkiller/core';

const processes = await scanLocalhost();
// [{ pid: 12345, port: 3000, name: 'node.exe', cmdline: 'node server.js', protected: false, ... }]

await killPid(12345);

const result = await killAll({ includeProtected: false });
// { killed: [12345, 67890], failed: [] }
```

Herhangi bir Node.js betiğinden veya Electron uygulamasından doğrudan kullan — sıradan bir npm paketidir.

---

## Alternatiflerle Karşılaştırma

| Araç | Platform | UI | Ağaç-öldürme | Sistem süreç koruması | Açık Kaynak |
|------|----------|-----|--------------|----------------------|-------------|
| **Localhost Killer** | Win/macOS/Linux | VS Code + Masaüstü | Var | Var | Evet (MIT) |
| `netstat -ano` + `taskkill` | Windows | Sadece CLI | manuel | Yok | yok |
| `kill-port` (npm) | çapraz platform | Sadece CLI | kısmen | Yok | Evet |
| `npx fkill` | çapraz platform | CLI / etkileşimli | Yok | Yok | Evet |
| TCPView (Sysinternals) | Windows | GUI | Yok | Yok | Hayır (kapalı) |
| Resource Monitor | Windows | GUI | Yok | Yok | Hayır (yerleşik) |

---

## Geliştirme

```bash
npm install
npm run build:core              # önce paylaşılan core'u derle

npm run dev:vscode              # esbuild --watch, başlatmak için F5
npm run dev:app                 # Vite + tsc --watch + Electron, UI hot reload
```

Proje yapısı, betikler ve Electron main ile renderer arasındaki IPC sözleşmesi her paketin README'sinde belgelenmiştir:

- [packages/core/](packages/core)
- [packages/vscode-extension/README.md](packages/vscode-extension/README.md)
- [packages/windows-app/README.md](packages/windows-app/README.md)

---

## Katkıda Bulunma

Pull request'lere açığız — [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bak. Paylaşılan tarayıcı ve öldürücü mantığı kasıtlı olarak küçük tutulmuştur (~250 satır), uçtan uca okumak kolaydır. Çoğu katkı şuralara düşecektir:

- Daha iyi süreç-metadata çıkarımı (CWD, ebeveyn PID, port-to-URL tahmini).
- macOS ve Linux UI'ları (core zaten `lsof` ve `ss` ile destekliyor).
- `@localhostkiller/core` etrafında kabuk betikleri için bir CLI sarmalayıcı.
- UI'larda daha iyi filtreleme ve gruplama.

---

## Sıkça Sorulan Sorular

**Yönetici izni gerekiyor mu?** Hayır. `taskkill /F` sahip olduğun tüm süreçlerde çalışır. Sistem servisleri (yönetici gerektirir) varsayılan olarak korumalı şeklinde filtrelenir.

**VS Code'u veya tarayıcımı öldürür mü?** Hayır. Varsayılan davranış yalnızca bir localhost portunu *dinleyen* süreçleri listeler. VS Code'un renderer'ı ve tarayıcın dinlemez — dışarı bağlanırlar.

**Sadece tarayıcı kütüphanesini kullanabilir miyim?** Evet. `npm i @localhostkiller/core` çalıştır ve `scanLocalhost()` çağır. Bir `LocalhostProcess[]` döndürür.

**Neden sadece TCP? UDP ne olacak?** Dev sunucuları neredeyse her zaman TCP'dir. UDP desteği muhtemel bir gelecek eklemesidir — ihtiyacın varsa issue aç.

**macOS veya Linux desteği?** Core çalışır (`lsof` ve `ss`) ve **VS Code eklentisi de orada sıfır değişiklikle çalışır** çünkü saf Node'dur. Bağımsız masaüstü uygulaması şu anda build hedefi olarak yalnızca Windows'tur — istersen `mac` ve `linux` hedefleri eklemek için `electron-builder.yml` dosyasını değiştir.

---

## Anahtar Kelimeler

`localhost portu öldür` · `windows port öldürme` · `taskkill port` · `netstat port öldür` · `EADDRINUSE çözüm` · `port zaten kullanımda` · `node sürecini öldür windows` · `dev server öldür` · `vscode port öldürme eklentisi` · `localhost port killer türkçe` · `windows port boşaltma` · `portu kim kullanıyor` · `windows port yönetimi` · `dev sunucu öldürücü` · `port 3000 dolu` · `port 5173 dolu` · `vite port killer` · `next.js port problemi` · `react dev server portu` · `npm run dev port hatası`

---

## Lisans

[MIT](./LICENSE) © 2026 localhostkiller katkıda bulunanları

Bu sana zaman kazandırdıysa repo'yu yıldızla — başkalarının bulmasına yardımcı olur.
