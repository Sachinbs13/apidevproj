import { LANGUAGES } from '../../constants/occupationInterests.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { cn } from '../../utils/cn.js';

function LanguagePicker({ compact = false, className }) {
  const { language, profileLanguage, hasSessionOverride, setLanguage, resetToProfileDefault } = useLanguage();
  const showReset = hasSessionOverride && language !== profileLanguage;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className={cn(
          'flex flex-wrap items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900/40',
          compact && 'gap-0',
        )}
        role="group"
        aria-label="Display language"
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            title={lang}
            className={cn(
              'rounded-lg font-bold uppercase tracking-wide transition',
              compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-xs',
              language === lang
                ? 'bg-sky-600 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white',
            )}
          >
            {lang.slice(0, 3)}
          </button>
        ))}
      </div>
      {showReset && (
        <button
          type="button"
          onClick={resetToProfileDefault}
          className="self-end text-[10px] font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
        >
          Reset to profile ({profileLanguage.slice(0, 3)})
        </button>
      )}
    </div>
  );
}

export default LanguagePicker;
