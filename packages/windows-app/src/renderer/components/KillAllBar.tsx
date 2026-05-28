import React from 'react';
import { Power } from './Icons';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  count: number;
  disabled: boolean;
  onClick: () => void;
}

export function KillAllBar({ count, disabled, onClick }: Props): JSX.Element {
  const { t } = useI18n();
  return (
    <div className="killbar">
      <button className="kill-all" disabled={disabled} onClick={onClick}>
        <Power size={16} />
        <span>{t.killBar.killAll}</span>
        {count > 0 && <span className="count">{count}</span>}
      </button>
    </div>
  );
}
