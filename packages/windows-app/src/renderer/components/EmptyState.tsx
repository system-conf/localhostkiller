import React from 'react';

export function EmptyState(): JSX.Element {
  return (
    <div className="empty">
      <div className="empty-icon">💤</div>
      <div className="empty-title">Localhost'ta dinlenen port yok</div>
      <div className="empty-sub">Dev sunucularını başlat, otomatik yenilenir.</div>
    </div>
  );
}
