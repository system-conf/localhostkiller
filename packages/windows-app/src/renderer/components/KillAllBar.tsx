import React from 'react';

interface Props {
  count: number;
  disabled: boolean;
  onClick: () => void;
}

export function KillAllBar({ count, disabled, onClick }: Props): JSX.Element {
  return (
    <div className="killbar">
      <button className="kill-all" disabled={disabled} onClick={onClick}>
        🔥 Kill All {count > 0 && <span className="count">{count}</span>}
      </button>
    </div>
  );
}
