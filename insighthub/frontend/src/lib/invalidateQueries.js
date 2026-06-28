import { queryClient } from './queryClient.js';
import { queryKeys } from '../constants/queryKeys.js';

export function invalidateNewsQueries() {
  queryClient.invalidateQueries({ queryKey: queryKeys.news.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.trending.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.local.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.search.all });
}

export function invalidateBriefQueries() {
  queryClient.invalidateQueries({ queryKey: queryKeys.brief.all });
}

export function invalidateUserQueries() {
  queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
}

export function invalidateAnalyticsQueries() {
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
}
