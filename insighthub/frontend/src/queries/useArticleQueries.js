import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchArticleById,
  compareByTopic,
  fetchAnalytics,
  fetchArticleSummary,
} from '../api/newsApi.js';
import {
  fetchSavedArticles,
  fetchReadingHistory,
  fetchSavedStatus,
  saveArticle,
  unsaveArticle,
  recordReadingHistory,
} from '../api/userApi.js';
import { queryKeys, STALE_TIME } from '../constants/queryKeys.js';

export function useArticleQuery(id) {
  return useQuery({
    queryKey: queryKeys.article.detail(id),
    queryFn: async () => {
      const res = await fetchArticleById(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: STALE_TIME.ARTICLE,
  });
}

export function useArticleSummaryQuery(articleId, lang) {
  const isEnglish = lang === 'English';

  return useQuery({
    queryKey: queryKeys.article.summary(articleId, lang),
    queryFn: async () => {
      const res = await fetchArticleSummary(articleId, lang);
      return {
        title: res.data?.title || '',
        summary: res.data?.summary || '',
      };
    },
    enabled: !!articleId && !isEnglish,
    staleTime: STALE_TIME.ARTICLE,
  });
}

export function useCompareQuery(topic, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.article.compare(topic),
    queryFn: async () => {
      const res = await compareByTopic(topic);
      return res.data?.multiSource || [];
    },
    enabled: enabled && !!topic,
    staleTime: STALE_TIME.SEARCH,
  });
}

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: async () => {
      const res = await fetchAnalytics();
      return res.data;
    },
    staleTime: STALE_TIME.ANALYTICS,
  });
}

export function useSavedArticlesQuery(page = 1, limit = 20, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.user.saved(page, limit),
    queryFn: async () => {
      const res = await fetchSavedArticles({ page, limit });
      return { items: res.data || [], total: res.total || 0 };
    },
    enabled,
    staleTime: STALE_TIME.USER,
  });
}

export function useReadingHistoryQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.user.history(page, limit),
    queryFn: async () => {
      const res = await fetchReadingHistory({ page, limit });
      return { items: res.data || [], total: res.total || 0 };
    },
    staleTime: STALE_TIME.USER,
  });
}

export function useSavedStatusQuery(articleId, isAuthenticated) {
  return useQuery({
    queryKey: queryKeys.user.savedStatus(articleId),
    queryFn: async () => {
      const res = await fetchSavedStatus(articleId);
      return res.data?.saved ?? false;
    },
    enabled: isAuthenticated && !!articleId,
    staleTime: STALE_TIME.USER,
  });
}

export function useToggleSaveMutation(articleId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ saved }) => {
      if (saved) {
        await unsaveArticle(articleId);
        return false;
      }
      await saveArticle(articleId);
      return true;
    },
    onMutate: async ({ saved }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.user.savedStatus(articleId) });
      const previous = queryClient.getQueryData(queryKeys.user.savedStatus(articleId));
      queryClient.setQueryData(queryKeys.user.savedStatus(articleId), !saved);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.user.savedStatus(articleId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.savedStatus(articleId) });
      queryClient.invalidateQueries({ queryKey: ['user', 'saved'] });
    },
  });
}

export function useRecordHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId) => recordReadingHistory(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'history'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.trending.all });
    },
  });
}
