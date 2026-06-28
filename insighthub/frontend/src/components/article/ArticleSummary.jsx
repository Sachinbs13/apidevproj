import { useLanguage } from '../../context/LanguageContext.jsx';
import { useArticleSummaryQuery } from '../../queries/useArticleQueries.js';
import { cn } from '../../utils/cn.js';

function ArticleSummary({ articleId, defaultText }) {
  const { language, isEnglish } = useLanguage();
  const { data: translation, isLoading } = useArticleSummaryQuery(articleId, language);

  const displayText = isEnglish ? defaultText : translation?.summary || defaultText;

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Summary
      </span>
      {isLoading && !isEnglish ? (
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      ) : (
        <p
          className={cn(
            'text-sm leading-relaxed text-slate-600 dark:text-slate-300',
            !isEnglish && translation?.summary && 'border-l-2 border-sky-500/40 bg-sky-50/50 pl-3 italic dark:bg-sky-950/10',
          )}
        >
          {displayText}
        </p>
      )}
    </div>
  );
}

export default ArticleSummary;
