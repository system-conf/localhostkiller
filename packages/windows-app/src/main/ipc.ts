import { ipcMain, shell } from 'electron';
import { scanLocalhost, killPid, killAll } from '@localhostkiller/core';
import { IPC } from '../shared/ipc-channels';

interface IpcCallbacks {
  hideToTray: () => void;
  quit: () => void;
}

export function registerIpc(cb: IpcCallbacks): void {
  ipcMain.handle(IPC.SCAN, async () => {
    return scanLocalhost();
  });

  ipcMain.handle(IPC.KILL, async (_e, pid: number) => {
    await killPid(pid);
    return { ok: true };
  });

  ipcMain.handle(IPC.KILL_ALL, async (_e, includeProtected = false) => {
    return killAll({ includeProtected });
  });

  ipcMain.handle(IPC.HIDE_TO_TRAY, () => {
    cb.hideToTray();
  });

  ipcMain.handle(IPC.QUIT, () => {
    cb.quit();
  });

  ipcMain.handle(IPC.OPEN_EXTERNAL, async (_e, url: string) => {
    if (typeof url !== 'string') return;
    if (!/^https?:\/\//i.test(url)) return;
    await shell.openExternal(url);
  });
}
