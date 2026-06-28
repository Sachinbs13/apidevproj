import { useState } from 'react';
import { Link } from 'react-router-dom';
import SourceBadge from './SourceBadge.jsx';
import ArticleMetaTags from './ArticleMetaTags.jsx';
import { cn } from '../../utils/cn.js';
import { articlePath } from '../../constants/routes.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useArticleSummaryQuery } from '../../queries/useArticleQueries.js';
import { getPrimarySourceName, getPublisherFromSourceRef } from '../../helpers/articleMeta.js';

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
  const primarySource = getPrimarySourceName(article);
  const extraSources = Math.max(0, sourceCount - 1);

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
          <ArticleMetaTags article={article} />

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

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1 text-[11px] text-slate-500">
            <span>{new Date(article.publishedAt).toLocaleString()}</span>

            {primarySource && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <SourceBadge name={primarySource} />
                {extraSources > 0 && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
                    +{extraSources} more
                  </span>
                )}
              </>
            )}
            
            {showScore && article.trendingScore != null && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  Impact {article.trendingScore}
                </span>
              </>
            )}

            {article.sentiment?.label && article.sentiment.label !== 'neutral' && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
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
              </>
            )}
          </div>

          {extraSources > 0 && sources.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {sources.slice(1).map((ref, i) => (
                <SourceBadge
                  key={`${ref.sourceName}-${i}`}
                  name={getPublisherFromSourceRef(article, ref)}
                />
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
