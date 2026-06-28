import { useQuery } from '@tanstack/react-query';
import { searchNews } from '../api/newsApi.js';
import { queryKeys, STALE_TIME } from '../constants/queryKeys.js';

export function useSearchQuery(query, page, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.search.query(query, page, 12),
    queryFn: async () => {
      const res = await searchNews({ q: query, page, limit: 12 });
      return {
        articles: res.data || [],
        pagination: res.pagination,
      };
    },
    enabled: enabled && !!query.trim(),
    staleTime: STALE_TIME.SEARCH,
  });
}
