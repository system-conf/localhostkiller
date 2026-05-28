export interface LocalhostProcess {
  pid: number;
  port: number;
  address: string;
  protocol: 'tcp' | 'tcp6';
  name: string;
  cmdline?: string;
  executablePath?: string;
  protected: boolean;
}

export interface KillResult {
  killed: number[];
  failed: { pid: number; error: string }[];
}
