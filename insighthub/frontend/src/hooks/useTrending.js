import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { fetchTrending } from '../api/newsApi.js';

export function useTrending(limit = 20) {
  const liveFromStore = useSelector((state) => state.news.liveArticles);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchTrending({ limit });
      setArticles(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load trending');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (liveFromStore.length > 0) {
      setArticles(liveFromStore);
    }
  }, [liveFromStore]);

  return { articles, loading, error, reload: load };
}

export default useTrending;
