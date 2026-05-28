import React from 'react';
import { Inbox } from './Icons';

export function EmptyState(): JSX.Element {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Inbox size={36} />
      </div>
      <div className="empty-title">No localhost ports are listening</div>
      <div className="empty-sub">
        Start a dev server (`npm run dev`, `python -m http.server`, etc.) and it will appear here.
        Auto-refresh keeps the list up to date.
      </div>
    </div>
  );
}
