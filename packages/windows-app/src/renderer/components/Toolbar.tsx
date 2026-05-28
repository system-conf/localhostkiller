import React from 'react';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: (v: boolean) => void;
  includeProtected: boolean;
  onToggleIncludeProtected: (v: boolean) => void;
  onRefresh: () => void;
  loading: boolean;
}

export function Toolbar(props: Props): JSX.Element {
  return (
    <div className="toolbar">
      <input
        className="search"
        type="search"
        placeholder="port, pid, name veya cmdline ara..."
        value={props.search}
        onChange={(e) => props.onSearch(e.target.value)}
      />
      <button
        className="ghost"
        onClick={props.onRefresh}
        disabled={props.loading}
        title="Refresh (F5)"
      >
        {props.loading ? '...' : '↻'} Refresh
      </button>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={props.autoRefresh}
          onChange={(e) => props.onToggleAutoRefresh(e.target.checked)}
        />
        Auto-refresh
      </label>
      <label className="checkbox" title="Sistem süreçlerini de Kill All'a dahil et (riskli)">
        <input
          type="checkbox"
          checked={props.includeProtected}
          onChange={(e) => props.onToggleIncludeProtected(e.target.checked)}
        />
        Include protected
      </label>
    </div>
  );
}
