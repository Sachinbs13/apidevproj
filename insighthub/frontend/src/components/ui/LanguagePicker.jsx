import { useEffect, useRef, useState } from 'react';
import { LANGUAGES } from '../../constants/occupationInterests.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { cn } from '../../utils/cn.js';

function LanguageIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
      />
    </svg>
  );
}

function LanguagePicker({ className, align = 'right', fullWidth = false }) {
  const { language, profileLanguage, hasSessionOverride, setLanguage, resetToProfileDefault } =
    useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const showReset = hasSessionOverride && language !== profileLanguage;

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(lang) {
    setLanguage(lang);
    setOpen(false);
  }

  function handleReset() {
    resetToProfileDefault();
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn('relative', fullWidth && 'w-full', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Select display language"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white',
          fullWidth ? 'w-full justify-between px-3 py-2' : 'p-2',
        )}
      >
        <span className="flex items-center gap-1.5">
          <LanguageIcon className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-wide">{language.slice(0, 3)}</span>
        </span>
        {fullWidth && (
          <svg
            className={cn('h-3.5 w-3.5 transition', open && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Display language"
          className={cn(
            'absolute top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950',
            align === 'right' ? 'right-0' : 'left-0',
            fullWidth && 'w-full',
          )}
        >
          <p className="border-b border-slate-100 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:border-slate-800">
            Display language
          </p>
          <ul className="max-h-56 overflow-y-auto p-1">
            {LANGUAGES.map((lang) => (
              <li key={lang}>
                <button
                  type="button"
                  role="option"
                  aria-selected={language === lang}
                  onClick={() => handleSelect(lang)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                    language === lang
                      ? 'bg-sky-50 font-semibold text-sky-700 dark:bg-sky-950/50 dark:text-sky-400'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900/60',
                  )}
                >
                  <span>{lang}</span>
                  {language === lang && (
                    <svg className="h-4 w-4 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {showReset && (
            <div className="border-t border-slate-100 p-2 dark:border-slate-800">
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-lg px-2 py-1.5 text-left text-[11px] font-medium text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/30"
              >
                Reset to default ({profileLanguage})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LanguagePicker;
