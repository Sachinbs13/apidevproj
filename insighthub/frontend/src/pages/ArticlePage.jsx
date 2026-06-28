import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useArticleQuery, useArticleSummaryQuery, useRecordHistoryMutation } from '../queries/useArticleQueries.js';
import ArticleSummary from '../components/article/ArticleSummary.jsx';
import SaveButton from '../components/article/SaveButton.jsx';
import SourceComparison from '../components/article/SourceComparison.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import SourceBadge from '../components/ui/SourceBadge.jsx';
import { ROUTES } from '../constants/routes.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { cn } from '../utils/cn.js';

function ArticlePage() {
  const { id } = useParams();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const historyRecorded = useRef(false);

  const { data: article, isLoading, error } = useArticleQuery(id);
  const { language, isEnglish } = useLanguage();
  const { data: translation, isLoading: loadingTranslation } = useArticleSummaryQuery(id, language);
  const recordHistory = useRecordHistoryMutation();

  const errorMessage = error?.response?.data?.message || error?.message || '';

  useEffect(() => {
    if (!isAuthenticated || !id || historyRecorded.current || !article) return;

    historyRecorded.current = true;
    recordHistory.mutate(id);
  }, [isAuthenticated, id, article]);

  if (isLoading) {
    return <LoadingSpinner label="Loading article..." />;
  }

  if (errorMessage || !article) {
    return (
      <EmptyState
        title="Article not found"
        description={errorMessage || 'This article may have been removed or the link is invalid.'}
        action={
          <Link
            to={ROUTES.HOME}
            className="inline-block rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            Back to Home
          </Link>
        }
      />
    );
  }

  const sources = article.sources || [];
  const sourceCount = article.sourceCount ?? sources.length;
  const displayTitle = isEnglish ? article.title : translation?.title || article.title;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        ← Back to feed
      </Link>

      {article.imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <img
            src={article.imageUrl}
            alt=""
            className="max-h-80 w-full object-cover"
            onError={(e) => {
              e.target.parentNode.style.display = 'none';
            }}
          />
        </div>
      )}

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sky-700 dark:bg-sky-950/80 dark:text-sky-400">
            {article.category}
          </span>
          {article.regionalInfo?.state && article.regionalInfo.state !== 'National' && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/55 dark:text-emerald-400">
              📍 {article.regionalInfo.state}
              {article.regionalInfo.city && ` • ${article.regionalInfo.city}`}
            </span>
          )}
          {sourceCount > 1 && (
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
              {sourceCount} sources
            </span>
          )}
        </div>

        <h1
          className={cn(
            'text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl',
            !isEnglish && translation?.title && 'italic',
          )}
        >
          {loadingTranslation && !isEnglish ? (
            <span className="block h-9 w-full max-w-2xl animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          ) : (
            displayTitle
          )}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
          <span>{new Date(article.publishedAt).toLocaleString()}</span>
          {article.sentiment?.label && article.sentiment.label !== 'neutral' && (
            <span
              className={cn(
                'capitalize font-semibold',
                article.sentiment.label === 'positive'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400',
              )}
            >
              {article.sentiment.label}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SaveButton articleId={article._id} />
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
            >
              Open original ↗
            </a>
          )}
        </div>

        {sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {sources.map((ref, index) => (
              <SourceBadge key={`${ref.sourceName}-${index}`} name={ref.sourceName} />
            ))}
          </div>
        )}
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/40">
        <ArticleSummary
          articleId={article._id}
          defaultText={article.description || article.title}
        />
      </section>

      {article.content && (
        <section className="prose prose-slate max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {article.content}
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/40">
        <SourceComparison article={article} />
      </section>
    </div>
  );
}

export default ArticlePage;
