import { useQuery } from '@tanstack/react-query';
import { fetchRecommendedSchemes } from '../../api/newsApi.js';
import { queryKeys, STALE_TIME } from '../../constants/queryKeys.js';
import SkeletonCard from '../ui/SkeletonCard.jsx';

function GovernmentSchemesSection() {
  const { data: schemes = [], isLoading } = useQuery({
    queryKey: [...queryKeys.news.all, 'schemes'],
    queryFn: async () => {
      const res = await fetchRecommendedSchemes();
      return res.data || [];
    },
    staleTime: STALE_TIME.NEWS,
  });

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (schemes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3" id="government-schemes">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Government schemes
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Welfare and subsidy programs detected in recent news
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {schemes.slice(0, 6).map((scheme) => (
          <article
            key={scheme.schemeName}
            className="w-72 shrink-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                {scheme.schemeName}
              </h3>
              <span className="shrink-0 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
                {scheme.category || 'General'}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
              {scheme.benefits}
            </p>
            {scheme.officialWebsite && (
              <a
                href={scheme.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400"
              >
                Visit portal →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default GovernmentSchemesSection;
