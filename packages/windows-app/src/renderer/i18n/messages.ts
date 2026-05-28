export type Lang = 'en' | 'tr' | 'de';

export interface Messages {
  app: {
    title: string;
    hide: string;
    hideTooltip: string;
    githubTooltip: string;
  };
  header: {
    killable: string;
    protected: string;
  };
  toolbar: {
    searchPlaceholder: string;
    refresh: string;
    refreshTooltip: string;
    autoRefresh: string;
    includeProtected: string;
    includeProtectedTooltip: string;
  };
  table: {
    port: string;
    pid: string;
    process: string;
    address: string;
    command: string;
    killTooltip: string;
    portTooltipPrefix: string;
    protectedBadge: string;
    protectedTooltip: string;
    noMatch: string;
  };
  killBar: {
    killAll: string;
  };
  empty: {
    title: string;
    sub: string;
  };
  modal: {
    killAllTitle: string;
    killAllBodyPart1: string;
    killAllBodyProtected: string;
    killAllBodyPart2: string;
    killAllConfirm: string;
    protectedTitle: string;
    protectedBodyPart1: string;
    protectedBodyPart2: string;
    protectedConfirm: string;
    cancel: string;
  };
  error: {
    dismiss: string;
    killedFailed: (killed: number, failed: number) => string;
  };
  language: {
    label: string;
  };
}

export const messages: Record<Lang, Messages> = {
  en: {
    app: {
      title: 'Localhost Killer',
      hide: 'Hide',
      hideTooltip: 'Hide to system tray',
      githubTooltip: 'View source on GitHub',
    },
    header: {
      killable: 'killable',
      protected: 'protected',
    },
    toolbar: {
      searchPlaceholder: 'Search by port, PID, name or command line...',
      refresh: 'Refresh',
      refreshTooltip: 'Refresh the list',
      autoRefresh: 'Auto-refresh',
      includeProtected: 'Include protected',
      includeProtectedTooltip: 'Include system processes in Kill All (risky)',
    },
    table: {
      port: 'Port',
      pid: 'PID',
      process: 'Process',
      address: 'Address',
      command: 'Command',
      killTooltip: 'Terminate this process',
      portTooltipPrefix: 'Open',
      protectedBadge: 'protected',
      protectedTooltip: 'System process',
      noMatch: 'No processes match the current search.',
    },
    killBar: {
      killAll: 'Kill All',
    },
    empty: {
      title: 'No localhost ports are listening',
      sub: 'Start a dev server (npm run dev, python -m http.server, etc.) and it will appear here. Auto-refresh keeps the list up to date.',
    },
    modal: {
      killAllTitle: 'Kill all localhost processes',
      killAllBodyPart1: '',
      killAllBodyProtected: ' (including protected)',
      killAllBodyPart2: ' process(es) will be terminated. Continue?',
      killAllConfirm: 'Kill All',
      protectedTitle: 'System process',
      protectedBodyPart1: 'PID ',
      protectedBodyPart2: ' appears to be a protected system process. Terminate anyway?',
      protectedConfirm: 'Kill anyway',
      cancel: 'Cancel',
    },
    error: {
      dismiss: 'dismiss',
      killedFailed: (k, f) => `Killed ${k}, failed ${f}`,
    },
    language: { label: 'Language' },
  },

  tr: {
    app: {
      title: 'Localhost Killer',
      hide: 'Gizle',
      hideTooltip: 'Sistem tepsisine gizle',
      githubTooltip: 'Kaynak kodu GitHub\'da gör',
    },
    header: {
      killable: 'kapatılabilir',
      protected: 'korumalı',
    },
    toolbar: {
      searchPlaceholder: 'Port, PID, ad veya komut satırına göre ara...',
      refresh: 'Yenile',
      refreshTooltip: 'Listeyi yenile',
      autoRefresh: 'Otomatik yenile',
      includeProtected: 'Korumalı dahil',
      includeProtectedTooltip: 'Kill All\'a sistem süreçlerini de dahil et (riskli)',
    },
    table: {
      port: 'Port',
      pid: 'PID',
      process: 'Süreç',
      address: 'Adres',
      command: 'Komut',
      killTooltip: 'Bu süreci sonlandır',
      portTooltipPrefix: 'Aç:',
      protectedBadge: 'korumalı',
      protectedTooltip: 'Sistem süreci',
      noMatch: 'Aramayla eşleşen süreç yok.',
    },
    killBar: {
      killAll: 'Hepsini Öldür',
    },
    empty: {
      title: 'Hiçbir localhost portu dinlenmiyor',
      sub: 'Bir dev sunucusu başlat (npm run dev, python -m http.server, vb.), burada görünecek. Otomatik yenileme listeyi güncel tutar.',
    },
    modal: {
      killAllTitle: 'Tüm localhost süreçlerini öldür',
      killAllBodyPart1: '',
      killAllBodyProtected: ' (korumalı dahil)',
      killAllBodyPart2: ' süreç sonlandırılacak. Devam edilsin mi?',
      killAllConfirm: 'Hepsini Öldür',
      protectedTitle: 'Sistem süreci',
      protectedBodyPart1: 'PID ',
      protectedBodyPart2: ' korumalı bir sistem süreci görünüyor. Yine de sonlandırılsın mı?',
      protectedConfirm: 'Yine de öldür',
      cancel: 'Vazgeç',
    },
    error: {
      dismiss: 'kapat',
      killedFailed: (k, f) => `${k} öldürüldü, ${f} başarısız`,
    },
    language: { label: 'Dil' },
  },

  de: {
    app: {
      title: 'Localhost Killer',
      hide: 'Ausblenden',
      hideTooltip: 'In den System-Tray minimieren',
      githubTooltip: 'Quellcode auf GitHub ansehen',
    },
    header: {
      killable: 'beendbar',
      protected: 'geschützt',
    },
    toolbar: {
      searchPlaceholder: 'Suche nach Port, PID, Name oder Befehlszeile...',
      refresh: 'Aktualisieren',
      refreshTooltip: 'Liste aktualisieren',
      autoRefresh: 'Auto-Aktualisierung',
      includeProtected: 'Geschützte einbeziehen',
      includeProtectedTooltip: 'Systemprozesse in Kill All einbeziehen (riskant)',
    },
    table: {
      port: 'Port',
      pid: 'PID',
      process: 'Prozess',
      address: 'Adresse',
      command: 'Befehl',
      killTooltip: 'Diesen Prozess beenden',
      portTooltipPrefix: 'Öffnen:',
      protectedBadge: 'geschützt',
      protectedTooltip: 'Systemprozess',
      noMatch: 'Keine Prozesse entsprechen der Suche.',
    },
    killBar: {
      killAll: 'Alle beenden',
    },
    empty: {
      title: 'Es lauschen keine localhost-Ports',
      sub: 'Starte einen Dev-Server (npm run dev, python -m http.server, etc.) und er erscheint hier. Die Auto-Aktualisierung hält die Liste aktuell.',
    },
    modal: {
      killAllTitle: 'Alle localhost-Prozesse beenden',
      killAllBodyPart1: '',
      killAllBodyProtected: ' (einschließlich geschützter)',
      killAllBodyPart2: ' Prozess(e) werden beendet. Fortfahren?',
      killAllConfirm: 'Alle beenden',
      protectedTitle: 'Systemprozess',
      protectedBodyPart1: 'PID ',
      protectedBodyPart2: ' scheint ein geschützter Systemprozess zu sein. Trotzdem beenden?',
      protectedConfirm: 'Trotzdem beenden',
      cancel: 'Abbrechen',
    },
    error: {
      dismiss: 'schließen',
      killedFailed: (k, f) => `${k} beendet, ${f} fehlgeschlagen`,
    },
    language: { label: 'Sprache' },
  },
};

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'de', label: 'DE' },
];

const STORAGE_KEY = 'lhk.lang';

export function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'tr' || stored === 'de') return stored;
  } catch {
    /* ignore */
  }
  const sys = (navigator.language || 'en').slice(0, 2).toLowerCase();
  if (sys === 'tr') return 'tr';
  if (sys === 'de') return 'de';
  return 'en';
}

export function persistLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}
