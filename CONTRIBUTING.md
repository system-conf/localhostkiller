# Contributing to Localhost Killer

Thanks for considering a contribution! This project is intentionally small — the shared scanner/killer logic is ~250 lines. That's a feature, not a bug. Please keep PRs focused.

## Getting Started

```bash
git clone https://github.com/system-conf/localhostkiller.git
cd localhostkiller
npm install
npm run build:core
```

Then, depending on what you're working on:

- **Core / scanner / killer**: edit `packages/core/src/**`, run `npm run build:core`.
- **VS Code extension**: `npm run dev:vscode` (esbuild watch), then F5 inside `packages/vscode-extension/` to launch an Extension Development Host.
- **Windows desktop app**: `npm run dev:app` — Vite serves the React renderer, `tsc -w` compiles the main process, Electron launches automatically.

## Code Style

- TypeScript strict mode, no `any` without comment justifying it
- Prefer pure functions in `core/`; no UI/Electron/VS Code APIs there
- Run `npm run build` at the root before opening a PR — it must compile clean across all three packages

## What's In Scope

✅ Welcome:
- Better cross-platform support (macOS UI, Linux UI)
- A CLI wrapper around `@localhostkiller/core`
- Process-tree visualization (parent/child grouping)
- Port-to-URL hints (detect HTTP, gRPC, Postgres, etc.)
- i18n for the desktop app
- Tests (Jest / vitest)
- Better icons (PRs with PNG/ICO assets)

❌ Out of scope:
- UDP support (open an issue first, design discussion needed)
- Network-level features (sniffing, packet capture)
- Anything that requires admin elevation by default
- Killing remote / non-local ports

## Reporting Bugs

Open an issue with:
- OS + version (`winver`)
- Node.js version (`node -v`)
- Steps to reproduce
- Expected vs. actual behavior
- Output of `node -e "require('@localhostkiller/core').scanLocalhost().then(r=>console.log(JSON.stringify(r,null,2)))"` if relevant

## License

By contributing you agree your contributions will be licensed under the [MIT License](LICENSE).
