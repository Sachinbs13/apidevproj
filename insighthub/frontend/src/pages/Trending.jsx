import { useTrending } from '../hooks/useTrending.js';
import { useSocketContext } from '../context/SocketContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { cn } from '../utils/cn.js';

function Trending() {
  const { articles, loading, error, reload } = useTrending(20);
  const { connected } = useSocketContext();
  const { isAuthenticated } = useAuth();

  if (loading && articles.length === 0) return <LoadingSpinner label="Loading trending..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Trending</h1>
          <p className="mt-1 text-sm text-slate-400">
            Top stories ranked by source coverage and recency
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
                connected
                  ? 'border-emerald-800/60 text-emerald-400'
                  : 'border-slate-700 text-slate-500',
              )}
            >
              <span
                className={cn('h-1.5 w-1.5 rounded-full', connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600')}
              />
              {connected ? 'Live updates' : 'Connecting...'}
            </span>
          )}
          <button
            type="button"
            onClick={reload}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition hover:text-white"
          >
            Refresh
          </button>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-3 text-sm text-amber-300">
          Sign in to receive live trending updates via WebSocket.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {articles.length === 0 ? (
        <p className="py-12 text-center text-slate-400">No trending stories in the current window.</p>
      ) : (
        <div className="space-y-3">
          {articles.map((article, index) => (
            <div key={article._id} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-400">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <ArticleCard article={article} showScore />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Trending;
