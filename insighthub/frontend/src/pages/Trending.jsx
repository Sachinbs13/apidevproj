import { useTrendingQuery } from '../queries/useTrendingQueries.js';
import { useSocketContext } from '../context/SocketContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import BreakingSection from '../components/trending/BreakingSection.jsx';
import TrendingTopics from '../components/trending/TrendingTopics.jsx';
import MostReadList from '../components/trending/MostReadList.jsx';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { cn } from '../utils/cn.js';

function Trending() {
  const { data: articles = [], isLoading, error, refetch } = useTrendingQuery(20);
  const { connected } = useSocketContext();
  const { isAuthenticated } = useAuth();

  const errorMessage = error?.response?.data?.message || error?.message || '';

  if (isLoading && articles.length === 0) {
    return <LoadingSpinner label="Loading trending..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trending</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Breaking stories, top topics, and ranked coverage
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
                connected
                  ? 'border-emerald-300 text-emerald-600 dark:border-emerald-800/60 dark:text-emerald-400'
                  : 'border-slate-300 text-slate-500 dark:border-slate-700',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  connected ? 'animate-pulse bg-emerald-500' : 'bg-slate-400',
                )}
              />
              {connected ? 'Live' : 'Connecting'}
            </span>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-400"
          >
            Refresh
          </button>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-300">
          Sign in to receive live trending and breaking updates.
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <BreakingSection fallbackArticles={articles} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendingTopics />
        <MostReadList />
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Top stories
        </h2>
        {articles.length === 0 ? (
          <EmptyState
            title="No trending stories"
            description="No stories ranked in the current time window."
          />
        ) : (
          <div className="space-y-3">
            {articles.map((article, index) => (
              <div key={article._id} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <ArticleCard article={article} showScore />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Trending;
