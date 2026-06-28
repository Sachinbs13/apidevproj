import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSearchQuery } from '../queries/useSearchQuery.js';
import { useTrendingQuery } from '../queries/useTrendingQueries.js';
import { fetchNews } from '../api/newsApi.js';
import { queryKeys, STALE_TIME } from '../constants/queryKeys.js';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import SkeletonCard from '../components/ui/SkeletonCard.jsx';
import TrendingTopics from '../components/trending/TrendingTopics.jsx';

function SearchDiscovery() {
  const { data: trending = [], isLoading: trendingLoading } = useTrendingQuery(6);
  const { data: latest = [], isLoading: latestLoading } = useQuery({
    queryKey: [...queryKeys.news.all, 'latest', 6],
    queryFn: async () => {
      const res = await fetchNews({ page: 1, limit: 6 });
      return res.data || [];
    },
    staleTime: STALE_TIME.NEWS,
  });

  const loading = trendingLoading || latestLoading;

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TrendingTopics />

      {trending.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Trending now
          </h2>
          <div className="space-y-3">
            {trending.map((article) => (
              <ArticleCard key={article._id} article={article} showScore />
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Latest stories
          </h2>
          <div className="space-y-3">
            {latest.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Search() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isFetching } = useSearchQuery(submitted, page, {
    enabled: !!submitted,
  });

  const articles = data?.articles ?? [];
  const pagination = data?.pagination;
  const errorMessage = error?.response?.data?.message || error?.message || '';
  const loading = isLoading || isFetching;
  const showDiscovery = !submitted;

  useEffect(() => {
    const q = searchParams.get('q')?.trim();
    if (q) {
      setQuery(q);
      setSubmitted(q);
      setPage(1);
    }
  }, [searchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSubmitted(trimmed);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Search</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Full-text search across all ingested articles
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news..."
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-600"
        />
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
        >
          Search
        </button>
      </form>

      {showDiscovery && <SearchDiscovery />}

      {loading && submitted && <LoadingSpinner label="Searching..." />}

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      {!loading && submitted && articles.length === 0 && !errorMessage && (
        <p className="py-8 text-center text-slate-500">No results for &ldquo;{submitted}&rdquo;</p>
      )}

      {submitted && articles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            {pagination?.total ?? articles.length} results for &ldquo;{submitted}&rdquo;
          </p>
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default Search;
