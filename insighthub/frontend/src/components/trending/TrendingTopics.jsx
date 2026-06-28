import { Link } from 'react-router-dom';
import { useTrendingTopicsQuery } from '../../queries/useTrendingQueries.js';
import { ROUTES } from '../../constants/routes.js';
import { cn } from '../../utils/cn.js';
import SkeletonCard from '../ui/SkeletonCard.jsx';

function TrendingTopics() {
  const { data: topics = [], isLoading } = useTrendingTopicsQuery(8);

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Top topics</h2>
        <SkeletonCard />
      </section>
    );
  }

  if (topics.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Top topics
      </h2>
      <div className="flex flex-wrap gap-2">
        {topics.map(({ topic, count }) => (
          <Link
            key={topic}
            to={`${ROUTES.SEARCH}?q=${encodeURIComponent(topic)}`}
            className={cn(
              'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium capitalize text-slate-700 transition hover:border-sky-400 hover:text-sky-600',
              'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400',
            )}
          >
            {topic}
            <span className="ml-1.5 text-slate-400">({count})</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TrendingTopics;
