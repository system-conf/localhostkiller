import React from 'react';
import { Refresh, Search } from './Icons';
import { useI18n } from '../i18n/I18nContext';

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
  const { t } = useI18n();
  return (
    <div className="toolbar">
      <div className="search-wrap">
        <Search size={14} className="search-icon" />
        <input
          className="search"
          type="search"
          placeholder={t.toolbar.searchPlaceholder}
          value={props.search}
          onChange={(e) => props.onSearch(e.target.value)}
        />
      </div>
      <button
        className="ghost icon-btn"
        onClick={props.onRefresh}
        disabled={props.loading}
        title={t.toolbar.refreshTooltip}
      >
        <Refresh size={14} className={props.loading ? 'spin' : ''} />
        <span>{t.toolbar.refresh}</span>
      </button>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={props.autoRefresh}
          onChange={(e) => props.onToggleAutoRefresh(e.target.checked)}
        />
        {t.toolbar.autoRefresh}
      </label>
      <label className="checkbox" title={t.toolbar.includeProtectedTooltip}>
        <input
          type="checkbox"
          checked={props.includeProtected}
          onChange={(e) => props.onToggleIncludeProtected(e.target.checked)}
        />
        {t.toolbar.includeProtected}
      </label>
    </div>
  );
}
