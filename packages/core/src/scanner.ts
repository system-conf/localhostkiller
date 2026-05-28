import { LocalhostProcess } from './types';
import { scanWindows } from './platform/windows';
import { scanLinux } from './platform/linux';
import { scanDarwin } from './platform/darwin';

export async function scanLocalhost(): Promise<LocalhostProcess[]> {
  switch (process.platform) {
    case 'win32':
      return scanWindows();
    case 'darwin':
      return scanDarwin();
    case 'linux':
      return scanLinux();
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}
