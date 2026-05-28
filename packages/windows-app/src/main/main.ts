import { app, BrowserWindow, nativeTheme, shell } from 'electron';
import * as path from 'path';
import { registerIpc } from './ipc';
import { createTray, destroyTray } from './tray';

const DEV_SERVER = process.env.LHK_DEV_SERVER;
const isDev = !!DEV_SERVER;

let mainWindow: BrowserWindow | null = null;

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    minWidth: 720,
    minHeight: 480,
    title: 'Localhost Killer',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#15171c' : '#fafafa',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.once('ready-to-show', () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev && DEV_SERVER) {
    void win.loadURL(DEV_SERVER);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    void win.loadFile(path.join(__dirname, '..', '..', 'dist-renderer', 'index.html'));
  }

  win.on('close', (e) => {
    if (!appIsQuitting) {
      e.preventDefault();
      win.hide();
    }
  });

  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
}

let appIsQuitting = false;

app.on('before-quit', () => {
  appIsQuitting = true;
});

function getOrCreateWindow(): BrowserWindow {
  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = createWindow();
  }
  return mainWindow;
}

function showWindow(): void {
  const win = getOrCreateWindow();
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    showWindow();
  });

  app.whenReady().then(() => {
    mainWindow = createWindow();
    registerIpc({
      hideToTray: () => mainWindow?.hide(),
      quit: () => {
        appIsQuitting = true;
        app.quit();
      },
    });
    createTray({
      onShow: showWindow,
      onKillAll: () => {
        if (mainWindow) {
          mainWindow.webContents.send('lhk:tray-kill-all');
          showWindow();
        }
      },
      onQuit: () => {
        appIsQuitting = true;
        app.quit();
      },
    });
  });

  app.on('window-all-closed', () => {
    // intentionally do not quit — app stays in tray
  });

  app.on('activate', () => {
    showWindow();
  });

  app.on('will-quit', () => {
    destroyTray();
  });
}
