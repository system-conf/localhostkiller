import { KillAllOptions, KillOptions, KillResult } from './types';
import { killWindows } from './platform/windows';
import { killLinux } from './platform/linux';
import { killDarwin } from './platform/darwin';
import { scanLocalhost } from './scanner';

export async function killPid(pid: number, opts: KillOptions = {}): Promise<void> {
  if (!Number.isFinite(pid) || pid <= 0) {
    throw new Error(`Invalid PID: ${pid}`);
  }
  switch (process.platform) {
    case 'win32':
      return killWindows(pid, opts.tree ?? true);
    case 'darwin':
      return killDarwin(pid);
    case 'linux':
      return killLinux(pid);
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

export async function killAll(opts: KillAllOptions = {}): Promise<KillResult> {
  const processes = await scanLocalhost();
  const targets = opts.includeProtected ? processes : processes.filter((p) => !p.protected);

  const uniquePids = Array.from(new Set(targets.map((p) => p.pid))).filter((pid) => pid > 0);

  const killed: number[] = [];
  const failed: { pid: number; error: string }[] = [];

  for (const pid of uniquePids) {
    try {
      await killPid(pid);
      killed.push(pid);
    } catch (err) {
      failed.push({ pid, error: (err as Error).message });
    }
  }

  return { killed, failed };
}
