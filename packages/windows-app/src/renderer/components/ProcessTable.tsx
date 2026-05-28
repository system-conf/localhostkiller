import React from 'react';
import type { LocalhostProcess } from '../types';
import { Dot, ExternalLink, Shield } from './Icons';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  items: LocalhostProcess[];
  busyPids: Set<number>;
  onKill: (proc: LocalhostProcess) => void;
  onOpenBrowser: (proc: LocalhostProcess) => void;
}

export function ProcessTable({ items, busyPids, onKill, onOpenBrowser }: Props): JSX.Element {
  const { t } = useI18n();
  return (
    <div className="table-wrap">
      <table className="ptable">
        <thead>
          <tr>
            <th className="col-port">{t.table.port}</th>
            <th className="col-pid">{t.table.pid}</th>
            <th className="col-name">{t.table.process}</th>
            <th className="col-addr">{t.table.address}</th>
            <th className="col-cmd">{t.table.command}</th>
            <th className="col-actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const busy = busyPids.has(p.pid);
            return (
              <tr key={`${p.protocol}-${p.address}-${p.port}-${p.pid}`} className={busy ? 'row-busy' : ''}>
                <td>
                  <div className="port-cell">
                    <Dot size={6} color={p.protected ? 'var(--warn)' : 'var(--ok)'} />
                    <a
                      href="#"
                      className="port-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenBrowser(p);
                      }}
                      title={`${t.table.portTooltipPrefix} http://localhost:${p.port}`}
                    >
                      :{p.port}
                    </a>
                    <ExternalLink size={11} className="port-ext" />
                  </div>
                </td>
                <td className="mono">{p.pid}</td>
                <td>
                  <div className="name-cell">
                    <span>{p.name}</span>
                    {p.protected && (
                      <span className="badge badge-protected" title={t.table.protectedTooltip}>
                        <Shield size={10} />
                        {t.table.protectedBadge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="mono dim">{p.address}</td>
                <td className="cmd" title={p.cmdline || ''}>
                  {p.cmdline || p.executablePath || ''}
                </td>
                <td className="col-actions">
                  <button
                    className="kill"
                    disabled={busy}
                    onClick={() => onKill(p)}
                    title={t.table.killTooltip}
                  >
                    {busy ? '...' : 'Kill'}
                  </button>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-row">
                {t.table.noMatch}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
