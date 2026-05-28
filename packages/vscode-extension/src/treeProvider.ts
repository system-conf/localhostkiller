import * as vscode from 'vscode';
import { scanLocalhost, LocalhostProcess } from '@localhostkiller/core';

export class LocalhostTreeItem extends vscode.TreeItem {
  constructor(public readonly proc: LocalhostProcess) {
    super(`:${proc.port}  ${proc.name}`, vscode.TreeItemCollapsibleState.None);

    const tooltipLines = [
      `Port: ${proc.port}`,
      `Address: ${proc.address}`,
      `Protocol: ${proc.protocol}`,
      `PID: ${proc.pid}`,
      `Process: ${proc.name}`,
    ];
    if (proc.executablePath) tooltipLines.push(`Path: ${proc.executablePath}`);
    if (proc.cmdline) tooltipLines.push(`Cmd: ${proc.cmdline}`);
    if (proc.protected) tooltipLines.push('⚠ Protected (system process)');
    this.tooltip = tooltipLines.join('\n');

    this.description = `PID ${proc.pid}${proc.protected ? '  • protected' : ''}`;
    this.iconPath = new vscode.ThemeIcon(
      proc.protected ? 'shield' : 'pulse',
      proc.protected ? new vscode.ThemeColor('charts.yellow') : undefined,
    );
    this.contextValue = proc.protected ? 'lhk-process-protected' : 'lhk-process';

    this.command = {
      title: 'Open in Browser',
      command: 'localhostkiller.openUrl',
      arguments: [this],
    };
  }
}

export class LocalhostTreeProvider implements vscode.TreeDataProvider<LocalhostTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private cache: LocalhostProcess[] = [];
  private scanning = false;
  private listeners = new Set<(procs: LocalhostProcess[]) => void>();

  getTreeItem(el: LocalhostTreeItem): vscode.TreeItem {
    return el;
  }

  async getChildren(): Promise<LocalhostTreeItem[]> {
    if (!this.scanning && this.cache.length === 0) {
      await this.refresh();
    }
    return this.cache.map((p) => new LocalhostTreeItem(p));
  }

  getCache(): LocalhostProcess[] {
    return this.cache;
  }

  onProcesses(cb: (procs: LocalhostProcess[]) => void): vscode.Disposable {
    this.listeners.add(cb);
    return { dispose: () => this.listeners.delete(cb) };
  }

  async refresh(): Promise<void> {
    if (this.scanning) return;
    this.scanning = true;
    try {
      this.cache = await scanLocalhost();
      for (const cb of this.listeners) cb(this.cache);
      this._onDidChangeTreeData.fire();
    } catch (err) {
      vscode.window.showErrorMessage(
        `Localhost Killer scan failed: ${(err as Error).message}`,
      );
      this.cache = [];
      for (const cb of this.listeners) cb(this.cache);
      this._onDidChangeTreeData.fire();
    } finally {
      this.scanning = false;
    }
  }
}
