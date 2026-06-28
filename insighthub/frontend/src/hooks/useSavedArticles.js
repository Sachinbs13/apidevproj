import {
  useSavedArticlesQuery,
  useReadingHistoryQuery,
} from '../queries/useArticleQueries.js';

export function useSavedArticles(page = 1, limit = 20) {
  const query = useSavedArticlesQuery(page, limit);
  return {
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    loading: query.isLoading,
    error: query.error?.response?.data?.message || query.error?.message || '',
    refetch: query.refetch,
  };
}

export function useReadingHistory(page = 1, limit = 20) {
  const query = useReadingHistoryQuery(page, limit);
  return {
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    loading: query.isLoading,
    error: query.error?.response?.data?.message || query.error?.message || '',
    refetch: query.refetch,
  };
}
