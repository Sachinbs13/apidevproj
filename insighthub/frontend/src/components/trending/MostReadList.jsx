import { Link } from 'react-router-dom';
import { useMostReadQuery } from '../../queries/useTrendingQueries.js';
import { articlePath } from '../../constants/routes.js';
import SkeletonCard from '../ui/SkeletonCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

function MostReadList() {
  const { data: articles = [], isLoading } = useMostReadQuery(8);

  if (isLoading) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Most read</h2>
        <SkeletonCard />
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <EmptyState
        title="No reading data yet"
        description="Most-read articles appear as users open stories across the platform."
        className="py-8"
      />
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Most read
      </h2>
      <ol className="space-y-2">
        {articles.map((article, index) => (
          <li
            key={article._id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Link
                to={articlePath(article._id)}
                className="line-clamp-2 text-sm font-semibold text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400"
              >
                {article.title}
              </Link>
              {article.viewCount > 0 && (
                <p className="mt-1 text-xs text-slate-500">{article.viewCount} views</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default MostReadList;
