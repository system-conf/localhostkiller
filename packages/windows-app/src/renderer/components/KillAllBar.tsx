import React from 'react';
import { Power } from './Icons';

interface Props {
  count: number;
  disabled: boolean;
  onClick: () => void;
}

export function KillAllBar({ count, disabled, onClick }: Props): JSX.Element {
  return (
    <div className="killbar">
      <button className="kill-all" disabled={disabled} onClick={onClick}>
        <Power size={16} />
        <span>Kill All</span>
        {count > 0 && <span className="count">{count}</span>}
      </button>
    </div>
  );
}
