import { execFile } from 'child_process';
import { promisify } from 'util';
import { LocalhostProcess, Protocol } from '../types';
import { isLocalhostAddress, isProtected } from '../filter';

const execFileP = promisify(execFile);

interface Row {
  protocol: Protocol;
  address: string;
  port: number;
  pid: number;
  name: string;
}

function parseSsOutput(stdout: string): Row[] {
  const rows: Row[] = [];
  const lines = stdout.split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('State') || line.startsWith('Netid')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 5) continue;
    const local = parts[3] || parts[4];
    const userField = parts[parts.length - 1];
    const local2 = parts.find((p) => /:\d+$/.test(p) && !p.includes('*')) ?? local;
    const m = local2.match(/^(\[?[^\]]+\]?|[\d.]+|\*):(\d+)$/);
    if (!m) continue;
    let address = m[1];
    if (address.startsWith('[') && address.endsWith(']')) {
      address = address.slice(1, -1);
    }
    if (address === '*') address = '0.0.0.0';
    const port = Number.parseInt(m[2], 10);
    if (!isLocalhostAddress(address)) continue;
    const pidMatch = userField.match(/pid=(\d+),fd=\d+,?.*?(?:name=([^,)]+))?/);
    const pid = pidMatch ? Number.parseInt(pidMatch[1], 10) : 0;
    const name = pidMatch?.[2] ?? `pid-${pid}`;
    const protocol: Protocol = address.includes(':') ? 'tcp6' : 'tcp';
    rows.push({ protocol, address, port, pid, name });
  }
  return rows;
}

export async function scanLinux(): Promise<LocalhostProcess[]> {
  let stdout = '';
  try {
    const r = await execFileP('ss', ['-tlnpH'], { timeout: 10_000 });
    stdout = r.stdout;
  } catch {
    return [];
  }
  const rows = parseSsOutput(stdout);
  const result: LocalhostProcess[] = rows.map((r) => ({
    pid: r.pid,
    port: r.port,
    address: r.address,
    protocol: r.protocol,
    name: r.name,
    protected: isProtected(r.pid, r.name),
  }));
  result.sort((a, b) => a.port - b.port);
  return result;
}

export async function killLinux(pid: number): Promise<void> {
  try {
    process.kill(pid, 'SIGKILL');
  } catch (err) {
    throw new Error(`kill failed for PID ${pid}: ${(err as Error).message}`);
  }
}
