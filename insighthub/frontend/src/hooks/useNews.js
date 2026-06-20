import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../api/newsApi.js';

export function useNews(initialParams = {}) {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [params, setParams] = useState({ page: 1, limit: 12, ...initialParams });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchNews(params);
      setArticles(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const setPage = (page) => setParams((prev) => ({ ...prev, page }));
  const setCategory = (category) =>
    setParams((prev) => ({ ...prev, category: category || undefined, page: 1 }));
  const setSource = (source) =>
    setParams((prev) => ({ ...prev, source: source || undefined, page: 1 }));

  return { articles, pagination, loading, error, params, setPage, setCategory, setSource, reload: load };
}

export default useNews;
