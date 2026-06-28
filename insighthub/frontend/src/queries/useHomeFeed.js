import { useQuery } from '@tanstack/react-query';
import { fetchNews, fetchPersonalizedFeed, searchNews } from '../api/newsApi.js';
import { getCategoryById } from '../constants/categories.js';
import { queryKeys, STALE_TIME } from '../constants/queryKeys.js';

function buildPagination(page, limit, total, fallback) {
  if (fallback) return fallback;
  return {
    page,
    limit,
    total: total ?? 0,
    totalPages: Math.ceil((total || 0) / limit) || 1,
    hasNext: page * limit < (total || 0),
    hasPrev: page > 1,
  };
}

export function useHomeFeed({ feedMode, categoryId, page, user }) {
  const isPersonalized = feedMode === 'personalized' && !!user;
  const category = getCategoryById(categoryId);

  return useQuery({
    queryKey: queryKeys.news.feed({
      feedMode,
      categoryId,
      page,
      userId: user?.id,
    }),
    queryFn: async () => {
      if (isPersonalized) {
        const res = await fetchPersonalizedFeed({ page, limit: 15 });
        const feed = res.data || {};
        const limit = feed.limit || 15;
        const currentPage = feed.page || page;
        const total = feed.total || 0;
        return {
          articles: feed.articles || [],
          pagination: buildPagination(currentPage, limit, total),
        };
      }

      if (category.searchQuery) {
        const res = await searchNews({ q: category.searchQuery, page, limit: 15 });
        return {
          articles: res.data || [],
          pagination: res.pagination || buildPagination(page, 15, res.data?.length),
        };
      }

      const res = await fetchNews({ page, limit: 15, ...category.params });
      return {
        articles: Array.isArray(res.data) ? res.data : [],
        pagination: res.pagination || buildPagination(page, 15),
      };
    },
    enabled: !isPersonalized || !!user,
    staleTime: STALE_TIME.NEWS,
  });
}
