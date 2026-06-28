import { useQuery } from '@tanstack/react-query';
import { fetchLocalNews } from '../api/newsApi.js';
import { queryKeys, STALE_TIME } from '../constants/queryKeys.js';

export function useLocalNews(state, city, { page = 1, limit = 6, enabled = true } = {}) {
  const query = useQuery({
    queryKey: queryKeys.local.news(state, city || '', page, limit),
    queryFn: async () => {
      const res = await fetchLocalNews({ state, city: city || undefined, page, limit });
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: enabled && !!state && state !== 'National',
    staleTime: STALE_TIME.LOCAL,
  });

  return {
    articles: query.data ?? [],
    pagination: null,
    loading: query.isLoading,
    error: query.error?.response?.data?.message || query.error?.message || '',
    refetch: query.refetch,
  };
}
