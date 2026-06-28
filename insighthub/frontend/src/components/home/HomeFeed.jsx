import { useSelector } from 'react-redux';
import ArticleCard from '../ui/ArticleCard.jsx';
import Pagination from '../ui/Pagination.jsx';
import SkeletonCard from '../ui/SkeletonCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

function LiveSidebar() {
  const liveArticles = useSelector((state) => state.news.liveArticles);

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-28 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-slate-800">
            {liveArticles.length}
          </span>
        </div>
        <div className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
          {liveArticles.length === 0 ? (
            <p className="py-8 text-center text-[11px] text-slate-500">
              Sign in to receive live article updates.
            </p>
          ) : (
            liveArticles.slice(0, 8).map((art) => (
              <div
                key={art._id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <a
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="line-clamp-2 text-xs font-semibold text-slate-700 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400"
                >
                  {art.title}
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

function HomeFeed({ articles, loading, error, pagination, onPageChange, onRetry }) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="space-y-4 lg:col-span-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Could not load headlines"
            description={error}
            action={
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
              >
                Retry
              </button>
            }
          />
        ) : articles.length === 0 ? (
          <EmptyState
            title="No articles found"
            description="Try another category or check that the backend is running and seeded."
          />
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}

        {!loading && articles.length > 0 && (
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        )}
      </div>
      <LiveSidebar />
    </div>
  );
}

export default HomeFeed;
