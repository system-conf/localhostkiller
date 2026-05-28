import { Tray, Menu, nativeImage, app } from 'electron';
import * as path from 'path';

interface TrayCallbacks {
  onShow: () => void;
  onKillAll: () => void;
  onQuit: () => void;
}

let tray: Tray | null = null;

function loadTrayIcon(): Electron.NativeImage {
  const candidates = [
    path.join(process.resourcesPath, 'tray.png'),
    path.join(__dirname, '..', '..', 'resources', 'tray.png'),
    path.join(app.getAppPath(), 'resources', 'tray.png'),
  ];
  for (const p of candidates) {
    const img = nativeImage.createFromPath(p);
    if (!img.isEmpty()) return img;
  }
  return nativeImage.createEmpty();
}

export function createTray(cb: TrayCallbacks): Tray {
  if (tray) return tray;
  const icon = loadTrayIcon();
  tray = new Tray(icon);
  tray.setToolTip('Localhost Killer');

  const menu = Menu.buildFromTemplate([
    { label: 'Show', click: () => cb.onShow() },
    { type: 'separator' },
    { label: 'Kill All Localhost', click: () => cb.onKillAll() },
    { type: 'separator' },
    { label: 'Quit', click: () => cb.onQuit() },
  ]);
  tray.setContextMenu(menu);
  tray.on('click', () => cb.onShow());
  tray.on('double-click', () => cb.onShow());
  return tray;
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
