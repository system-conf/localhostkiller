# Security Policy

## Supported Versions

The latest minor release is supported. We don't backport patches.

## Reporting a Vulnerability

If you find a security issue, **please do not open a public GitHub issue**. Instead:

1. Open a private security advisory via GitHub: `Security` tab → `Report a vulnerability`
2. Or email the maintainer (see repository profile)

Please include:
- A description of the issue
- Steps to reproduce / proof of concept
- Affected versions
- Suggested remediation (if any)

You'll get an initial response within 7 days.

## Threat Model

Localhost Killer:
- Reads the output of `netstat -ano` (Windows) / `lsof` (macOS) / `ss` (Linux)
- Calls `Get-CimInstance Win32_Process` via PowerShell with a fixed filter built from numeric PIDs (no string injection possible — input is `Number.parseInt`'d)
- Spawns `taskkill.exe /F /T /PID <pid>` via `execFile` with an array of args (no shell interpolation)

It does **not**:
- Open network sockets
- Send data anywhere
- Modify files outside of standard app-data directories
- Require admin elevation

The VS Code extension and desktop app both use `contextIsolation: true` and a minimal preload bridge. The renderer has no Node.js access.
