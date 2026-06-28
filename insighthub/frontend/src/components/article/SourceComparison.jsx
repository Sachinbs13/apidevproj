import { Link } from 'react-router-dom';
import { useCompareQuery } from '../../queries/useArticleQueries.js';
import { ROUTES } from '../../constants/routes.js';
import ArticleCard from '../ui/ArticleCard.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import SourceBadge from '../ui/SourceBadge.jsx';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'is', 'are', 'with', 'from',
]);

function topicFromTitle(title = '') {
  const words = title
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word.toLowerCase()));
  return words.slice(0, 2).join(' ') || title.split(' ').slice(0, 2).join(' ');
}

function SourceComparison({ article }) {
  const variants = article?.variants || [];
  const topic = topicFromTitle(article?.title);

  const { data: related = [], isLoading: loadingRelated } = useCompareQuery(topic, {
    enabled: !!topic && !!article?._id,
  });

  const filteredRelated = related.filter((item) => item._id !== article._id).slice(0, 5);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          How sources covered this story
          {variants.length > 0 && (
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              {variants.length} sources
            </span>
          )}
        </h2>

        {variants.length === 0 ? (
          <p className="text-sm text-slate-500">No source variants tracked for this article yet.</p>
        ) : (
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div
                key={`${variant.sourceName}-${index}`}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <SourceBadge name={variant.sourceName} />
                  {variant.source?.status && (
                    <p className="text-xs capitalize text-slate-500">
                      Status: {variant.source.status}
                    </p>
                  )}
                  {variant.fetchedAt && (
                    <p className="text-xs text-slate-500">
                      Fetched {new Date(variant.fetchedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                {variant.originalUrl && (
                  <a
                    href={variant.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
                  >
                    Read on {variant.sourceName} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {topic && (
        <section>
          <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Related multi-source coverage
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            Stories about &ldquo;{topic}&rdquo; from multiple outlets
          </p>

          {loadingRelated && <LoadingSpinner label="Finding related stories..." />}

          {!loadingRelated && filteredRelated.length === 0 && (
            <p className="text-sm text-slate-500">No related multi-source stories found.</p>
          )}

          {!loadingRelated && filteredRelated.length > 0 && (
            <div className="space-y-3">
              {filteredRelated.map((item) => (
                <ArticleCard key={item._id} article={item} />
              ))}
            </div>
          )}

          <Link
            to={`${ROUTES.SEARCH}?q=${encodeURIComponent(topic)}`}
            className="mt-4 inline-block text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
          >
            Search more on &ldquo;{topic}&rdquo; →
          </Link>
        </section>
      )}
    </div>
  );
}

export default SourceComparison;
