import React from 'react';
import { Inbox } from './Icons';
import { useI18n } from '../i18n/I18nContext';

export function EmptyState(): JSX.Element {
  const { t } = useI18n();
  return (
    <div className="empty">
      <div className="empty-icon">
        <Inbox size={36} />
      </div>
      <div className="empty-title">{t.empty.title}</div>
      <div className="empty-sub">{t.empty.sub}</div>
    </div>
  );
}
