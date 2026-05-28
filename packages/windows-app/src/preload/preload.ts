import { contextBridge, ipcRenderer } from 'electron';
import type { LocalhostProcess, KillResult } from '@localhostkiller/core';
import { IPC } from '../shared/ipc-channels';

const api = {
  scan(): Promise<LocalhostProcess[]> {
    return ipcRenderer.invoke(IPC.SCAN);
  },
  kill(pid: number): Promise<{ ok: true }> {
    return ipcRenderer.invoke(IPC.KILL, pid);
  },
  killAll(includeProtected = false): Promise<KillResult> {
    return ipcRenderer.invoke(IPC.KILL_ALL, includeProtected);
  },
  hideToTray(): Promise<void> {
    return ipcRenderer.invoke(IPC.HIDE_TO_TRAY);
  },
  quit(): Promise<void> {
    return ipcRenderer.invoke(IPC.QUIT);
  },
  openExternal(url: string): Promise<void> {
    return ipcRenderer.invoke(IPC.OPEN_EXTERNAL, url);
  },
  onTrayKillAll(cb: () => void): () => void {
    const handler = () => cb();
    ipcRenderer.on('lhk:tray-kill-all', handler);
    return () => ipcRenderer.removeListener('lhk:tray-kill-all', handler);
  },
};

export type LhkApi = typeof api;

contextBridge.exposeInMainWorld('lhk', api);
