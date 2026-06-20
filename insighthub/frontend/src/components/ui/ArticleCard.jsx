import SourceBadge from './SourceBadge.jsx';
import { cn } from '../../utils/cn.js';

function ArticleCard({ article, showScore, className }) {
  const sources = article.sources || [];
  const sourceCount = article.sourceCount ?? sources.length;

  return (
    <article
      className={cn(
        'group rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900/80',
        className,
      )}
    >
      <div className="flex gap-4">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            className="hidden h-20 w-28 shrink-0 rounded-lg object-cover sm:block"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="min-w-0 flex-1">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="line-clamp-2 font-medium text-sky-400 transition group-hover:text-sky-300"
          >
            {article.title}
          </a>
          {article.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">{article.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs capitalize text-slate-500">{article.category}</span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-500">
              {new Date(article.publishedAt).toLocaleString()}
            </span>
            {showScore && article.trendingScore != null && (
              <>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs font-medium text-violet-400">
                  Score {article.trendingScore}
                </span>
              </>
            )}
            {sourceCount > 1 && (
              <>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs text-emerald-400">{sourceCount} sources</span>
              </>
            )}
            {article.sentiment?.label && article.sentiment.label !== 'neutral' && (
              <>
                <span className="text-xs text-slate-600">·</span>
                <span
                  className={`text-xs capitalize ${
                    article.sentiment.label === 'positive'
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {article.sentiment.label}
                </span>
              </>
            )}
          </div>
          {sources.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {sources.map((ref, i) => (
                <SourceBadge key={`${ref.sourceName}-${i}`} name={ref.sourceName} />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
