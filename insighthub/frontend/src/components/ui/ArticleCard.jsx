import { useState } from 'react';
import { Link } from 'react-router-dom';
import SourceBadge from './SourceBadge.jsx';
import { cn } from '../../utils/cn.js';
import { articlePath } from '../../constants/routes.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useArticleSummaryQuery } from '../../queries/useArticleQueries.js';

function ArticleCard({ article, showScore, className }) {
  const sources = article.sources || [];
  const sourceCount = article.sourceCount ?? sources.length;
  const { language, isEnglish } = useLanguage();
  const { data: translation, isLoading: loadingTranslation } = useArticleSummaryQuery(
    article._id,
    language,
  );

  const [showSchemeDetails, setShowSchemeDetails] = useState(false);

  const title = isEnglish ? article.title : translation?.title || article.title;
  const description = isEnglish
    ? article.description
    : translation?.summary || article.description;

  return (
    <article
      className={cn(
        'group relative rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700',
        className
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        {article.imageUrl && (
          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-900 sm:w-40">
            <img
              src={article.imageUrl}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.parentNode.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded bg-sky-950/80 border border-sky-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-sky-400">
              {article.category}
            </span>
            
            {article.regionalInfo?.state && article.regionalInfo.state !== 'National' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/55 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/15">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                📍 {article.regionalInfo.state}
                {article.regionalInfo.city && ` • ${article.regionalInfo.city}`}
              </span>
            )}
          </div>

          <div className="flex items-start gap-2">
            <Link
              to={articlePath(article._id)}
              className={cn(
                'block flex-1 text-base font-bold leading-snug text-slate-900 transition hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400',
                !isEnglish && translation?.title && 'italic',
              )}
            >
              {loadingTranslation && !isEnglish ? (
                <span className="inline-block h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              ) : (
                title
              )}
            </Link>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded p-1 text-slate-400 transition hover:text-sky-500"
                title="Open original"
              >
                ↗
              </a>
            )}
          </div>

          <div className="text-slate-400 text-xs leading-relaxed">
            {loadingTranslation && !isEnglish ? (
              <div className="space-y-1.5 py-1">
                <div className="h-2 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-2 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ) : description ? (
              <p
                className={cn(
                  'line-clamp-2',
                  !isEnglish && translation?.summary && 'border-l-2 border-sky-500/40 bg-sky-50/50 pl-3 italic dark:bg-sky-950/10',
                )}
              >
                {description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-[11px] text-slate-500">
            <span>{new Date(article.publishedAt).toLocaleString()}</span>
            <span>•</span>
            
            {showScore && article.trendingScore != null && (
              <>
                <span className="font-semibold text-violet-400">Impact Score: {article.trendingScore}</span>
                <span>•</span>
              </>
            )}

            {sourceCount > 1 && (
              <>
                <span className="font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/20 px-1.5 py-0.2 rounded border border-emerald-500/10">
                  ⚡ {sourceCount} Sources Tracked
                </span>
                <span>•</span>
              </>
            )}

            {article.sentiment?.label && article.sentiment.label !== 'neutral' && (
              <span
                className={cn(
                  'capitalize font-bold',
                  article.sentiment.label === 'positive' ? 'text-emerald-400' : 'text-rose-400'
                )}
              >
                {article.sentiment.label}
              </span>
            )}
          </div>

          {sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sources.map((ref, i) => (
                <SourceBadge key={`${ref.sourceName}-${i}`} name={ref.sourceName} />
              ))}
            </div>
          )}

          {article.schemeDetails?.isSchemeRelated && (
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
              <button
                onClick={() => setShowSchemeDetails(!showSchemeDetails)}
                className="rounded-lg bg-emerald-950/30 border border-emerald-900/50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 hover:bg-emerald-950/60 transition duration-150 flex items-center gap-1.5"
              >
                <span>📜</span>
                {showSchemeDetails ? 'Hide details' : 'Gov Scheme Active'}
              </button>
            </div>
          )}

          {showSchemeDetails && article.schemeDetails && (
            <div className="mt-3 overflow-hidden rounded-xl border border-emerald-950/50 bg-gradient-to-b from-slate-950/80 to-emerald-950/5 p-4.5 space-y-2.5 text-xs">
              <div className="flex justify-between items-start gap-2 border-b border-emerald-950/20 pb-2">
                <h4 className="font-extrabold text-emerald-400 text-sm flex items-center gap-1">
                  <span>🏛️</span> {article.schemeDetails.schemeName || 'Government Scheme'}
                </h4>
                <a
                  href={article.schemeDetails.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-350 hover:underline font-bold"
                >
                  Official Portal ↗
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="font-extrabold text-slate-500 block uppercase tracking-widest text-[9px]">Eligibility Rules</span>
                  <p className="text-slate-350 mt-1 leading-relaxed">{article.schemeDetails.eligibility}</p>
                </div>
                <div>
                  <span className="font-extrabold text-slate-500 block uppercase tracking-widest text-[9px]">Financial & Welfare Benefits</span>
                  <p className="text-slate-350 mt-1 leading-relaxed">{article.schemeDetails.benefits}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
