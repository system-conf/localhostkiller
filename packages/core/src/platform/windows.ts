import { execFile } from 'child_process';
import { promisify } from 'util';
import { LocalhostProcess, Protocol } from '../types';
import { isLocalhostAddress, isProtected } from '../filter';

const execFileP = promisify(execFile);

interface RawListener {
  protocol: Protocol;
  address: string;
  port: number;
  pid: number;
}

interface ProcessMeta {
  pid: number;
  name: string;
  cmdline?: string;
  executablePath?: string;
}

const NETSTAT_TIMEOUT = 10_000;
const POWERSHELL_TIMEOUT = 15_000;

function parseLocalAddress(field: string): { address: string; port: number } | null {
  if (field.startsWith('[')) {
    const close = field.lastIndexOf(']');
    if (close === -1) return null;
    const address = field.slice(1, close);
    const portStr = field.slice(close + 2);
    const port = Number.parseInt(portStr, 10);
    if (!Number.isFinite(port)) return null;
    return { address, port };
  }
  const lastColon = field.lastIndexOf(':');
  if (lastColon === -1) return null;
  const address = field.slice(0, lastColon);
  const port = Number.parseInt(field.slice(lastColon + 1), 10);
  if (!Number.isFinite(port)) return null;
  return { address, port };
}

function parseNetstatOutput(stdout: string): RawListener[] {
  const listeners: RawListener[] = [];
  for (const rawLine of stdout.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || !line.toUpperCase().includes('LISTENING')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 5) continue;
    const proto = parts[0].toLowerCase();
    if (proto !== 'tcp' && proto !== 'tcpv6' && proto !== 'tcp6') continue;
    const local = parseLocalAddress(parts[1]);
    if (!local) continue;
    if (!isLocalhostAddress(local.address)) continue;
    const pid = Number.parseInt(parts[parts.length - 1], 10);
    if (!Number.isFinite(pid)) continue;
    const protocol: Protocol = local.address.includes(':') ? 'tcp6' : 'tcp';
    listeners.push({ protocol, address: local.address, port: local.port, pid });
  }
  return listeners;
}

async function runNetstat(): Promise<string> {
  const { stdout } = await execFileP('netstat.exe', ['-ano', '-p', 'TCP'], {
    timeout: NETSTAT_TIMEOUT,
    windowsHide: true,
    maxBuffer: 4 * 1024 * 1024,
  });
  return stdout;
}

async function runNetstatTcp6(): Promise<string> {
  try {
    const { stdout } = await execFileP('netstat.exe', ['-ano', '-p', 'TCPv6'], {
      timeout: NETSTAT_TIMEOUT,
      windowsHide: true,
      maxBuffer: 4 * 1024 * 1024,
    });
    return stdout;
  } catch {
    return '';
  }
}

async function fetchProcessMetadata(pids: number[]): Promise<Map<number, ProcessMeta>> {
  const meta = new Map<number, ProcessMeta>();
  if (pids.length === 0) return meta;

  const filter = pids.map((p) => `ProcessId=${p}`).join(' or ');
  const script = [
    `$ErrorActionPreference='SilentlyContinue';`,
    `Get-CimInstance Win32_Process -Filter "${filter}" |`,
    `Select-Object ProcessId,Name,CommandLine,ExecutablePath |`,
    `ConvertTo-Json -Compress -Depth 3`,
  ].join(' ');

  let stdout = '';
  try {
    const result = await execFileP(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', script],
      {
        timeout: POWERSHELL_TIMEOUT,
        windowsHide: true,
        maxBuffer: 4 * 1024 * 1024,
      },
    );
    stdout = result.stdout.trim();
  } catch {
    return meta;
  }

  if (!stdout) return meta;

  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return meta;
  }

  const records = Array.isArray(parsed) ? parsed : [parsed];
  for (const rec of records) {
    if (!rec || typeof rec !== 'object') continue;
    const r = rec as Record<string, unknown>;
    const pid = Number(r.ProcessId);
    if (!Number.isFinite(pid)) continue;
    meta.set(pid, {
      pid,
      name: typeof r.Name === 'string' ? r.Name : `pid-${pid}`,
      cmdline: typeof r.CommandLine === 'string' ? r.CommandLine : undefined,
      executablePath:
        typeof r.ExecutablePath === 'string' ? r.ExecutablePath : undefined,
    });
  }
  return meta;
}

export async function scanWindows(): Promise<LocalhostProcess[]> {
  const [tcp4Out, tcp6Out] = await Promise.all([runNetstat(), runNetstatTcp6()]);
  const listeners = [...parseNetstatOutput(tcp4Out), ...parseNetstatOutput(tcp6Out)];

  const uniquePids = Array.from(new Set(listeners.map((l) => l.pid))).filter(
    (pid) => pid > 0,
  );
  const meta = await fetchProcessMetadata(uniquePids);

  const seen = new Set<string>();
  const result: LocalhostProcess[] = [];
  for (const l of listeners) {
    const key = `${l.protocol}:${l.address}:${l.port}:${l.pid}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const info = meta.get(l.pid);
    const name = info?.name ?? `pid-${l.pid}`;
    result.push({
      pid: l.pid,
      port: l.port,
      address: l.address,
      protocol: l.protocol,
      name,
      cmdline: info?.cmdline,
      executablePath: info?.executablePath,
      protected: isProtected(l.pid, name),
    });
  }

  result.sort((a, b) => a.port - b.port || a.pid - b.pid);
  return result;
}

export async function killWindows(pid: number, tree = true): Promise<void> {
  const args = ['/F'];
  if (tree) args.push('/T');
  args.push('/PID', String(pid));
  try {
    await execFileP('taskkill.exe', args, {
      timeout: 10_000,
      windowsHide: true,
    });
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { stderr?: string; code?: number };
    const msg = e.stderr?.toString().trim() || e.message;
    throw new Error(`taskkill failed for PID ${pid}: ${msg}`);
  }
}
