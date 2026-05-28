# GitHub Repo Setup — SEO Checklist

Bu dosya GitHub'a push ettikten sonra **manuel** yapman gerekenleri listeler. Repo SEO ve AI keşfi için kritik.

## 1. Repo "About" alanı

GitHub'da repo sayfası → sağ üst ⚙ (Settings) ikonu:

- **Description** (160 karakter, anahtar kelimeli):
  ```
  Find and kill any process listening on a localhost port (127.0.0.1, 0.0.0.0). Fixes EADDRINUSE. VS Code extension + Windows desktop app. MIT.
  ```

- **Website**: (varsa) `https://localhostkiller.dev` veya boş bırak

- **Topics** (mutlaka ekle — AI'lar ve GitHub search topic'leri yüksek ağırlıkla kullanır):
  ```
  localhost
  port-killer
  kill-port
  eaddrinuse
  vscode-extension
  electron
  typescript
  windows
  developer-tools
  dev-server
  netstat
  taskkill
  port-management
  productivity
  free-port
  monorepo
  open-source
  desktop-app
  cross-platform
  nodejs
  ```

## 2. Repo özellikleri (Settings → General → Features)

Aç:
- ✅ Issues
- ✅ Discussions (community Q&A için)
- ✅ Wiki (opsiyonel)
- ✅ Sponsorships (opsiyonel)

## 3. Branch protection (Settings → Branches → Add rule)

`main` branch:
- ✅ Require pull request before merging
- ✅ Require status checks to pass (CI workflow)

## 4. GitHub Pages (opsiyonel ama SEO için güçlü)

Settings → Pages → Source: `Deploy from branch` → `main` → `/docs` folder.
Sonra `docs/index.html` yazarsan `your-username.github.io/localhostkiller` ile landing page olur. Google ve AI bot'ları için çok değerli.

## 5. İlk Release

```bash
git tag v0.1.0
git push origin v0.1.0
```

`.github/workflows/release.yml` otomatik tetiklenir:
- VSIX paket üretir → release'e ekler
- Windows installer + portable EXE üretir → release'e ekler

Release notes'a şunları ekle (Markdown):
- Ne işe yarıyor (2-3 cümle)
- Kurulum komutları
- Bilinen sorunlar

## 6. Marketplace publish (opsiyonel)

VS Code Marketplace:
1. https://marketplace.visualstudio.com/manage adresinde publisher hesabı aç
2. `packages/vscode-extension/package.json` içindeki `"publisher": "localhostkiller"` alanını **kendi publisher ID'nle** değiştir
3. `npm install -g @vscode/vsce`
4. `vsce login your-publisher-id`
5. `cd packages/vscode-extension && vsce publish`

## 7. Şu placeholder'ları değiştir

Tüm dosyalarda `your-username` ve `your-org` geçen yerleri kendi GitHub kullanıcı adınla değiştir:

```powershell
# PowerShell
Get-ChildItem -Recurse -File -Include *.md,*.json,*.yml | ForEach-Object {
  (Get-Content $_ -Raw) -replace 'your-username','GERCEK-KULLANICI-ADIN' | Set-Content $_
}
```

## 8. README'deki screenshot placeholder'ları

README'de henüz screenshot yok. Şunları ekle:
- `docs/screenshots/vscode-sidebar.png` — VS Code sidebar görünümü
- `docs/screenshots/desktop-app.png` — Electron app ana ekran
- `docs/screenshots/tray-menu.png` — Sistem tepsisi menüsü

README'de:
```markdown
![VS Code Sidebar](docs/screenshots/vscode-sidebar.png)
![Desktop App](docs/screenshots/desktop-app.png)
```

GitHub kart önizlemesi (Open Graph) için en az 1 tane 1280×640 PNG çok değerli. AI'lar ve sosyal medya bunu kullanıyor.
