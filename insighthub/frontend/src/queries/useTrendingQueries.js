import { useQuery } from '@tanstack/react-query';
import { fetchTrending, fetchTrendingTopics, fetchMostRead } from '../api/newsApi.js';
import { queryKeys, STALE_TIME } from '../constants/queryKeys.js';

export function useTrendingQuery(limit = 20) {
  return useQuery({
    queryKey: queryKeys.trending.list(limit),
    queryFn: async () => {
      const res = await fetchTrending({ limit });
      return res.data || [];
    },
    staleTime: STALE_TIME.TRENDING,
  });
}

export function useTrendingTopicsQuery(limit = 8) {
  return useQuery({
    queryKey: queryKeys.trending.topics(limit),
    queryFn: async () => {
      const res = await fetchTrendingTopics({ limit });
      return res.data || [];
    },
    staleTime: STALE_TIME.TRENDING,
  });
}

export function useMostReadQuery(limit = 8) {
  return useQuery({
    queryKey: queryKeys.trending.mostRead(limit),
    queryFn: async () => {
      const res = await fetchMostRead({ limit });
      return res.data || [];
    },
    staleTime: STALE_TIME.TRENDING,
  });
}
