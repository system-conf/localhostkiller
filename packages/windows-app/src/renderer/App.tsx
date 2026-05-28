import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { ProcessTable } from './components/ProcessTable';
import { KillAllBar } from './components/KillAllBar';
import { EmptyState } from './components/EmptyState';
import { ConfirmModal } from './components/ConfirmModal';
import { Flame, EyeOff } from './components/Icons';
import type { LocalhostProcess } from './types';

const AUTO_REFRESH_MS = 5000;

export function App(): JSX.Element {
  const [items, setItems] = useState<LocalhostProcess[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [includeProtected, setIncludeProtected] = useState(false);
  const [pendingKillAll, setPendingKillAll] = useState(false);
  const [pendingProtectedPid, setPendingProtectedPid] = useState<number | null>(null);
  const [busyPids, setBusyPids] = useState<Set<number>>(new Set());
  const initialLoad = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await window.lhk.scan();
      setItems(next);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      initialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      void refresh();
    }, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [autoRefresh, refresh]);

  useEffect(() => {
    const off = window.lhk.onTrayKillAll(() => setPendingKillAll(true));
    return off;
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) =>
        String(p.port).includes(q) ||
        String(p.pid).includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.cmdline?.toLowerCase().includes(q) ?? false),
    );
  }, [items, search]);

  const killableCount = useMemo(
    () => items.filter((p) => includeProtected || !p.protected).length,
    [items, includeProtected],
  );
  const protectedCount = useMemo(() => items.filter((p) => p.protected).length, [items]);

  const markBusy = (pid: number, busy: boolean) => {
    setBusyPids((prev) => {
      const next = new Set(prev);
      if (busy) next.add(pid);
      else next.delete(pid);
      return next;
    });
  };

  const handleKill = useCallback(
    async (proc: LocalhostProcess) => {
      if (proc.protected) {
        setPendingProtectedPid(proc.pid);
        return;
      }
      markBusy(proc.pid, true);
      try {
        await window.lhk.kill(proc.pid);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        markBusy(proc.pid, false);
        await refresh();
      }
    },
    [refresh],
  );

  const confirmKillProtected = useCallback(async () => {
    if (pendingProtectedPid === null) return;
    const pid = pendingProtectedPid;
    setPendingProtectedPid(null);
    markBusy(pid, true);
    try {
      await window.lhk.kill(pid);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      markBusy(pid, false);
      await refresh();
    }
  }, [pendingProtectedPid, refresh]);

  const confirmKillAll = useCallback(async () => {
    setPendingKillAll(false);
    setLoading(true);
    try {
      const result = await window.lhk.killAll(includeProtected);
      if (result.failed.length) {
        setError(`Killed ${result.killed.length}, failed ${result.failed.length}`);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      await refresh();
    }
  }, [includeProtected, refresh]);

  return (
    <div className="app">
      <header className="header">
        <div className="title">
          <Flame size={18} className="brand-flame" />
          <span className="title-text">Localhost Killer</span>
          <span className="title-sep" />
          <span className="title-meta">
            <strong>{killableCount}</strong>
            <span className="dim"> killable</span>
            {protectedCount > 0 && (
              <>
                <span className="dim"> · </span>
                <strong>{protectedCount}</strong>
                <span className="dim"> protected</span>
              </>
            )}
          </span>
        </div>
        <div className="header-actions">
          <button
            className="ghost icon-btn"
            onClick={() => window.lhk.hideToTray()}
            title="Hide to system tray"
          >
            <EyeOff size={14} />
            <span>Hide</span>
          </button>
        </div>
      </header>

      <Toolbar
        search={search}
        onSearch={setSearch}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={setAutoRefresh}
        includeProtected={includeProtected}
        onToggleIncludeProtected={setIncludeProtected}
        onRefresh={() => void refresh()}
        loading={loading}
      />

      {error && (
        <div className="banner banner-error" onClick={() => setError(null)}>
          {error} <span className="dismiss">dismiss</span>
        </div>
      )}

      <main className="main">
        {!loading && items.length === 0 ? (
          <EmptyState />
        ) : (
          <ProcessTable
            items={visible}
            busyPids={busyPids}
            onKill={handleKill}
            onOpenBrowser={(p) => window.lhk.openExternal(`http://localhost:${p.port}`)}
          />
        )}
      </main>

      <KillAllBar
        count={killableCount}
        disabled={loading || killableCount === 0}
        onClick={() => setPendingKillAll(true)}
      />

      {pendingKillAll && (
        <ConfirmModal
          title="Kill All Localhost Processes"
          body={`${killableCount} process(es) will be terminated${
            includeProtected ? ' (including protected)' : ''
          }. Continue?`}
          confirmLabel="Kill All"
          danger
          onCancel={() => setPendingKillAll(false)}
          onConfirm={() => void confirmKillAll()}
        />
      )}

      {pendingProtectedPid !== null && (
        <ConfirmModal
          title="System process"
          body={`PID ${pendingProtectedPid} appears to be a protected system process. Terminate anyway?`}
          confirmLabel="Kill anyway"
          danger
          onCancel={() => setPendingProtectedPid(null)}
          onConfirm={() => void confirmKillProtected()}
        />
      )}
    </div>
  );
}
