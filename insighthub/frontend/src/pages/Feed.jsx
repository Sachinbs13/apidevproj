import { useEffect, useState } from 'react';
import { useNews } from '../hooks/useNews.js';
import { fetchSources } from '../api/newsApi.js';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import StatusPill from '../components/ui/StatusPill.jsx';

const CATEGORIES = ['general', 'technology', 'business', 'politics', 'science', 'health', 'sports'];

function Feed() {
  const { articles, pagination, loading, error, params, setPage, setCategory, setSource, reload } =
    useNews();
  const [sources, setSources] = useState([]);

  useEffect(() => {
    fetchSources()
      .then((res) => setSources(res.data || []))
      .catch(() => {});
  }, []);

  if (loading && articles.length === 0) return <LoadingSpinner label="Loading feed..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">News Feed</h1>
        <p className="mt-1 text-sm text-slate-400">Aggregated headlines from all sources</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory('')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            !params.category
              ? 'bg-sky-600 text-white'
              : 'border border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
              params.category === cat
                ? 'bg-sky-600 text-white'
                : 'border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {sources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sources.map((source) => (
            <button
              key={source._id}
              type="button"
              onClick={() => setSource(params.source === source.name ? '' : source.name)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition ${
                params.source === source.name
                  ? 'border-sky-600 bg-sky-950/40 text-sky-400'
                  : 'border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {source.name}
              <StatusPill status={source.status} />
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
          <button type="button" onClick={reload} className="ml-3 underline">
            Retry
          </button>
        </div>
      )}

      {articles.length === 0 ? (
        <p className="py-12 text-center text-slate-400">
          No articles yet. Ensure the backend is running and API keys are configured.
        </p>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}

export default Feed;
