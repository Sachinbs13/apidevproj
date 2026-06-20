import { useState } from 'react';
import { searchNews } from '../api/newsApi.js';
import ArticleCard from '../components/ui/ArticleCard.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

function Search() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runSearch(q, page = 1) {
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await searchNews({ q, page, limit: 12 });
      setArticles(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(query);
    runSearch(query);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Search</h1>
        <p className="mt-1 text-sm text-slate-400">Full-text search across all ingested articles</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news..."
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-600"
        />
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
        >
          Search
        </button>
      </form>

      {loading && <LoadingSpinner label="Searching..." />}

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && submitted && articles.length === 0 && !error && (
        <p className="py-8 text-center text-slate-400">No results for &ldquo;{submitted}&rdquo;</p>
      )}

      {articles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            {pagination?.total ?? articles.length} results for &ldquo;{submitted}&rdquo;
          </p>
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
          <Pagination
            pagination={pagination}
            onPageChange={(page) => runSearch(submitted, page)}
          />
        </div>
      )}
    </div>
  );
}

export default Search;
