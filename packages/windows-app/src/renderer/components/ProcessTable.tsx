import React from 'react';
import type { LocalhostProcess } from '../types';
import { Dot, ExternalLink, Shield } from './Icons';

interface Props {
  items: LocalhostProcess[];
  busyPids: Set<number>;
  onKill: (proc: LocalhostProcess) => void;
  onOpenBrowser: (proc: LocalhostProcess) => void;
}

export function ProcessTable({ items, busyPids, onKill, onOpenBrowser }: Props): JSX.Element {
  return (
    <div className="table-wrap">
      <table className="ptable">
        <thead>
          <tr>
            <th className="col-port">Port</th>
            <th className="col-pid">PID</th>
            <th className="col-name">Process</th>
            <th className="col-addr">Address</th>
            <th className="col-cmd">Command</th>
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
                      title={`Open http://localhost:${p.port}`}
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
                      <span className="badge badge-protected" title="System process">
                        <Shield size={10} />
                        protected
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
                    title="Terminate this process"
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
                No processes match the current search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
