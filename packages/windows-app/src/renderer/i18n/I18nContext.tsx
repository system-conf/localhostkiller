import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { detectLang, Lang, messages, Messages, persistLang } from './messages';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [lang, setLangState] = useState<Lang>(() => detectLang());

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    persistLang(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t: messages[lang] }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
