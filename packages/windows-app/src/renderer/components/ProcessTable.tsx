import React from 'react';
import type { LocalhostProcess } from '../types';

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
            <th style={{ width: 70 }}>Port</th>
            <th style={{ width: 70 }}>PID</th>
            <th style={{ width: 160 }}>Process</th>
            <th style={{ width: 100 }}>Address</th>
            <th>Command</th>
            <th style={{ width: 110, textAlign: 'right' }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const busy = busyPids.has(p.pid);
            return (
              <tr key={`${p.protocol}-${p.address}-${p.port}-${p.pid}`}>
                <td>
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
                </td>
                <td className="mono">{p.pid}</td>
                <td>
                  {p.name}
                  {p.protected && (
                    <span className="badge badge-protected" title="System process">
                      protected
                    </span>
                  )}
                </td>
                <td className="mono dim">{p.address}</td>
                <td className="cmd" title={p.cmdline || ''}>
                  {p.cmdline || p.executablePath || ''}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="kill"
                    disabled={busy}
                    onClick={() => onKill(p)}
                    title="Kill this process"
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
                Aramayla eşleşen süreç yok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
