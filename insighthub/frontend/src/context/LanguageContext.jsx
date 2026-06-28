import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES } from '../constants/occupationInterests.js';
import { DISPLAY_LANG_KEY } from '../constants/storageKeys.js';
import { useAuth } from './AuthContext.jsx';

const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(DISPLAY_LANG_KEY);
    if (stored && LANGUAGES.includes(stored)) return stored;
  } catch {
    return null;
  }
  return null;
}

export function LanguageProvider({ children }) {
  const { user } = useAuth();
  const profileLanguage = user?.preferences?.preferredLanguage || 'English';
  const [hasSessionOverride, setHasSessionOverride] = useState(() => Boolean(readStoredLanguage()));
  const [language, setLanguageState] = useState(() => readStoredLanguage() || profileLanguage);

  useEffect(() => {
    if (!hasSessionOverride) {
      setLanguageState(profileLanguage);
    }
  }, [profileLanguage, hasSessionOverride]);

  const setLanguage = useCallback((lang) => {
    if (!LANGUAGES.includes(lang)) return;
    setLanguageState(lang);
    setHasSessionOverride(true);
    try {
      localStorage.setItem(DISPLAY_LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const resetToProfileDefault = useCallback(() => {
    setHasSessionOverride(false);
    setLanguageState(profileLanguage);
    try {
      localStorage.removeItem(DISPLAY_LANG_KEY);
    } catch {
      /* ignore */
    }
  }, [profileLanguage]);

  const value = useMemo(
    () => ({
      language,
      profileLanguage,
      hasSessionOverride,
      setLanguage,
      resetToProfileDefault,
      isEnglish: language === 'English',
    }),
    [language, profileLanguage, hasSessionOverride, setLanguage, resetToProfileDefault],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

export default LanguageContext;
