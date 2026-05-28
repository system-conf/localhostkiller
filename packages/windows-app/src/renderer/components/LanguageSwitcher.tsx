import React from 'react';
import { LANGS, Lang } from '../i18n/messages';
import { useI18n } from '../i18n/I18nContext';

export function LanguageSwitcher(): JSX.Element {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label={t.language.label}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-pill${l.code === lang ? ' active' : ''}`}
          onClick={() => setLang(l.code as Lang)}
          title={l.code.toUpperCase()}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
