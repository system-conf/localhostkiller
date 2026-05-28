import React from 'react';
import { Refresh, Search } from './Icons';

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
      <div className="search-wrap">
        <Search size={14} className="search-icon" />
        <input
          className="search"
          type="search"
          placeholder="Search by port, PID, name or command line..."
          value={props.search}
          onChange={(e) => props.onSearch(e.target.value)}
        />
      </div>
      <button
        className="ghost icon-btn"
        onClick={props.onRefresh}
        disabled={props.loading}
        title="Refresh"
      >
        <Refresh size={14} className={props.loading ? 'spin' : ''} />
        <span>Refresh</span>
      </button>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={props.autoRefresh}
          onChange={(e) => props.onToggleAutoRefresh(e.target.checked)}
        />
        Auto-refresh
      </label>
      <label className="checkbox" title="Include system processes in Kill All (risky)">
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
