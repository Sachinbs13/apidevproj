import { useState } from 'react';
import SourceBadge from './SourceBadge.jsx';
import { cn } from '../../utils/cn.js';
import { fetchArticleSummary } from '../../api/newsApi.js';
import toast from 'react-hot-toast';

function ArticleCard({ article, showScore, className }) {
  const sources = article.sources || [];
  const sourceCount = article.sourceCount ?? sources.length;

  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [translationText, setTranslationText] = useState('');
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  async function handleLanguageChange(lang) {
    setSelectedLang(lang);
    if (lang === 'English') {
      setTranslationText('');
      return;
    }

    setLoadingTranslation(true);
    try {
      const res = await fetchArticleSummary(article._id, lang);
      setTranslationText(res.data.summary);
    } catch (err) {
      toast.error(`Could not translate to ${lang}`);
      setSelectedLang('English');
    } finally {
      setLoadingTranslation(false);
    }
  }

  return (
    <article
      className={cn(
        'group relative rounded-2xl border border-slate-900 bg-slate-950/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-800/80 hover:bg-slate-900/30 hover:shadow-xl hover:shadow-sky-950/5',
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
          {/* Top category & region row */}
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

          {/* Title */}
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="block text-base font-extrabold text-slate-100 leading-snug transition hover:text-sky-400"
          >
            {article.title}
          </a>

          {/* Description or translated text */}
          <div className="text-slate-400 text-xs leading-relaxed">
            {loadingTranslation ? (
              <div className="space-y-1.5 py-1">
                <div className="h-2 w-full animate-pulse rounded bg-slate-900" />
                <div className="h-2 w-3/4 animate-pulse rounded bg-slate-900" />
              </div>
            ) : translationText ? (
              <p className="italic text-slate-350 border-l-2 border-sky-500/40 pl-3 py-0.5 bg-sky-950/10 rounded-r">
                {translationText}
              </p>
            ) : (
              article.description && <p className="line-clamp-2 text-slate-400">{article.description}</p>
            )}
          </div>

          {/* Meta Info Row */}
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

          {/* Source Badges */}
          {sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sources.map((ref, i) => (
                <SourceBadge key={`${ref.sourceName}-${i}`} name={ref.sourceName} />
              ))}
            </div>
          )}

          {/* Action Row: Translate Summary & Schemes details toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/60 pt-3">
            {/* Multilingual translation selection widget */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-900/80">
              <span className="font-bold">Translate:</span>
              {['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase transition duration-150',
                    selectedLang === lang ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'hover:text-slate-200'
                  )}
                >
                  {lang.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Scheme Indicator button */}
            {article.schemeDetails?.isSchemeRelated && (
              <button
                onClick={() => setShowSchemeDetails(!showSchemeDetails)}
                className="rounded-lg bg-emerald-950/30 border border-emerald-900/50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 hover:bg-emerald-950/60 transition duration-150 flex items-center gap-1.5"
              >
                <span>📜</span>
                {showSchemeDetails ? 'Hide details' : 'Gov Scheme Active'}
              </button>
            )}
          </div>

          {/* Collapsible Welfare Scheme specifications details */}
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
