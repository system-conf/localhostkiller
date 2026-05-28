export type Protocol = 'tcp' | 'tcp6';

export interface LocalhostProcess {
  pid: number;
  port: number;
  address: string;
  protocol: Protocol;
  name: string;
  cmdline?: string;
  executablePath?: string;
  protected: boolean;
}

export interface KillResult {
  killed: number[];
  failed: { pid: number; error: string }[];
}

export interface ScanOptions {
  includeIpv6?: boolean;
}

export interface KillOptions {
  tree?: boolean;
}

export interface KillAllOptions {
  includeProtected?: boolean;
}
