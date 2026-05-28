import * as vscode from 'vscode';
import { killAll, killPid } from '@localhostkiller/core';
import { LocalhostTreeItem, LocalhostTreeProvider } from './treeProvider';

function getConfig() {
  return vscode.workspace.getConfiguration('localhostkiller');
}

export function registerCommands(
  context: vscode.ExtensionContext,
  provider: LocalhostTreeProvider,
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('localhostkiller.refresh', async () => {
      await provider.refresh();
    }),

    vscode.commands.registerCommand(
      'localhostkiller.killOne',
      async (item: LocalhostTreeItem | undefined) => {
        const proc = item?.proc;
        if (!proc) return;

        if (proc.protected) {
          const choice = await vscode.window.showWarningMessage(
            `${proc.name} (PID ${proc.pid}) korumalı bir sistem süreci görünüyor. Yine de öldürmek istiyor musun?`,
            { modal: true },
            'Kill',
          );
          if (choice !== 'Kill') return;
        }

        try {
          await killPid(proc.pid);
          vscode.window.showInformationMessage(
            `Killed PID ${proc.pid} (port ${proc.port}).`,
          );
        } catch (err) {
          vscode.window.showErrorMessage((err as Error).message);
        }
        await provider.refresh();
      },
    ),

    vscode.commands.registerCommand('localhostkiller.killAll', async () => {
      const cfg = getConfig();
      const confirm = cfg.get<boolean>('confirmKillAll', true);
      const includeProtected = cfg.get<boolean>('includeProtected', false);

      const cache = provider.getCache();
      const targets = includeProtected ? cache : cache.filter((p) => !p.protected);
      if (targets.length === 0) {
        vscode.window.showInformationMessage('Killable bir port bulunamadı.');
        return;
      }

      if (confirm) {
        const choice = await vscode.window.showWarningMessage(
          `${targets.length} localhost süreci öldürülecek. Devam edilsin mi?`,
          { modal: true },
          'Kill All',
        );
        if (choice !== 'Kill All') return;
      }

      const result = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Localhost Killer: killing...',
          cancellable: false,
        },
        () => killAll({ includeProtected }),
      );

      const msg = `Killed ${result.killed.length} process(es)${
        result.failed.length ? `, ${result.failed.length} failed` : ''
      }.`;
      if (result.failed.length) {
        vscode.window.showWarningMessage(msg);
      } else {
        vscode.window.showInformationMessage(msg);
      }
      await provider.refresh();
    }),

    vscode.commands.registerCommand(
      'localhostkiller.copyPid',
      async (item: LocalhostTreeItem | undefined) => {
        if (!item) return;
        await vscode.env.clipboard.writeText(String(item.proc.pid));
      },
    ),

    vscode.commands.registerCommand(
      'localhostkiller.copyPort',
      async (item: LocalhostTreeItem | undefined) => {
        if (!item) return;
        await vscode.env.clipboard.writeText(String(item.proc.port));
      },
    ),

    vscode.commands.registerCommand(
      'localhostkiller.copyCommand',
      async (item: LocalhostTreeItem | undefined) => {
        if (!item) return;
        await vscode.env.clipboard.writeText(item.proc.cmdline ?? item.proc.name);
      },
    ),

    vscode.commands.registerCommand(
      'localhostkiller.openUrl',
      async (item: LocalhostTreeItem | undefined) => {
        if (!item) return;
        const url = `http://localhost:${item.proc.port}`;
        await vscode.env.openExternal(vscode.Uri.parse(url));
      },
    ),
  );
}
