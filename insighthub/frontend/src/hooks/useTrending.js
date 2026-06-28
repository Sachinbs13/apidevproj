import { useTrendingQuery } from '../queries/useTrendingQueries.js';

export function useTrending(limit = 20) {
  const query = useTrendingQuery(limit);
  return {
    articles: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.response?.data?.message || query.error?.message || '',
    reload: query.refetch,
  };
}

export default useTrending;
