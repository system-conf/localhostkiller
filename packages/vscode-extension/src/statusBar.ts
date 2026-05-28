import * as vscode from 'vscode';
import { LocalhostProcess } from '@localhostkiller/core';
import { LocalhostTreeProvider } from './treeProvider';

export function registerStatusBar(
  context: vscode.ExtensionContext,
  provider: LocalhostTreeProvider,
): vscode.StatusBarItem {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  item.command = 'localhostkiller.view.focus';
  item.tooltip = 'Click to open Localhost Killer view';
  context.subscriptions.push(item);

  const update = (procs: LocalhostProcess[]) => {
    const cfg = vscode.workspace.getConfiguration('localhostkiller');
    if (!cfg.get<boolean>('statusBar', true)) {
      item.hide();
      return;
    }
    const count = procs.filter((p) => !p.protected).length;
    item.text = `$(flame) ${count} localhost`;
    item.show();
  };

  context.subscriptions.push(provider.onProcesses(update));
  update(provider.getCache());

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('localhostkiller.statusBar')) {
        update(provider.getCache());
      }
    }),
  );

  return item;
}
