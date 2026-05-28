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

function parseLsof(stdout: string): Row[] {
  const rows: Row[] = [];
  for (const raw of stdout.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('COMMAND')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 9) continue;
    const command = parts[0];
    const pid = Number.parseInt(parts[1], 10);
    const node = parts[7];
    const nameField = parts.slice(8).join(' ');
    const arrow = nameField.split(' ')[0];
    const m = arrow.match(/^(\[?[^\]]+\]?|[\d.]+|\*):(\d+)$/);
    if (!m) continue;
    let address = m[1];
    if (address.startsWith('[') && address.endsWith(']')) address = address.slice(1, -1);
    if (address === '*') address = '0.0.0.0';
    const port = Number.parseInt(m[2], 10);
    if (!isLocalhostAddress(address)) continue;
    const protocol: Protocol = node.includes('6') ? 'tcp6' : 'tcp';
    rows.push({ protocol, address, port, pid, name: command });
  }
  return rows;
}

export async function scanDarwin(): Promise<LocalhostProcess[]> {
  let stdout = '';
  try {
    const r = await execFileP('lsof', ['-nP', '-iTCP', '-sTCP:LISTEN'], {
      timeout: 10_000,
    });
    stdout = r.stdout;
  } catch {
    return [];
  }
  const rows = parseLsof(stdout);
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

export async function killDarwin(pid: number): Promise<void> {
  try {
    process.kill(pid, 'SIGKILL');
  } catch (err) {
    throw new Error(`kill failed for PID ${pid}: ${(err as Error).message}`);
  }
}
