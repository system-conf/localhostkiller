import * as vscode from 'vscode';
import { LocalhostTreeProvider } from './treeProvider';
import { registerCommands } from './commands';
import { registerStatusBar } from './statusBar';

let autoRefreshTimer: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const provider = new LocalhostTreeProvider();

  const view = vscode.window.createTreeView('localhostkiller.view', {
    treeDataProvider: provider,
    showCollapseAll: false,
  });
  context.subscriptions.push(view);

  registerCommands(context, provider);
  registerStatusBar(context, provider);

  void provider.refresh();

  const applyAutoRefresh = () => {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer);
      autoRefreshTimer = undefined;
    }
    const seconds = vscode.workspace
      .getConfiguration('localhostkiller')
      .get<number>('autoRefreshSeconds', 0);
    if (seconds > 0) {
      autoRefreshTimer = setInterval(() => {
        void provider.refresh();
      }, seconds * 1000);
    }
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('localhostkiller.autoRefreshSeconds')) {
        applyAutoRefresh();
      }
    }),
    { dispose: () => autoRefreshTimer && clearInterval(autoRefreshTimer) },
  );
  applyAutoRefresh();
}

export function deactivate(): void {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = undefined;
  }
}
