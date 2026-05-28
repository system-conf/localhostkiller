const PROTECTED_NAMES = new Set([
  'system',
  'system idle process',
  'idle',
  'services.exe',
  'lsass.exe',
  'wininit.exe',
  'csrss.exe',
  'smss.exe',
  'winlogon.exe',
  'svchost.exe',
  'spoolsv.exe',
  'fontdrvhost.exe',
  'dwm.exe',
  'mscorsvw.exe',
  'memcompression',
  'registry',
  'secure system',
]);

const PROTECTED_PIDS = new Set<number>([0, 4]);

export function isProtected(pid: number, name: string): boolean {
  if (PROTECTED_PIDS.has(pid)) return true;
  return PROTECTED_NAMES.has(name.trim().toLowerCase());
}

export const LOCALHOST_ADDRESSES = new Set([
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '::',
]);

export function isLocalhostAddress(address: string): boolean {
  if (LOCALHOST_ADDRESSES.has(address)) return true;
  if (address.startsWith('127.')) return true;
  return false;
}
