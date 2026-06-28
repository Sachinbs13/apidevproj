import { useQuery } from '@tanstack/react-query';
import { fetchTodayBrief } from '../api/newsApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { queryKeys, STALE_TIME } from '../constants/queryKeys.js';

export function useTodayBrief(enabled = true) {
  const { user } = useAuth();
  const { language: lang } = useLanguage();
  const occupation = user?.preferences?.occupation || 'General';

  const query = useQuery({
    queryKey: queryKeys.brief.today(lang, occupation),
    queryFn: async () => {
      const res = await fetchTodayBrief({ lang });
      return res.data;
    },
    enabled: enabled && !!user,
    staleTime: STALE_TIME.BRIEF,
  });

  return {
    brief: query.data,
    loading: query.isLoading,
    error: query.error?.response?.data?.message || query.error?.message || '',
    lang,
    occupation,
    refetch: query.refetch,
  };
}
