import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { articlePath } from '../../constants/routes.js';
import ArticleCard from '../ui/ArticleCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

function BreakingSection({ fallbackArticles = [] }) {
  const breakingAlerts = useSelector((state) => state.news.breakingAlerts);
  const hasBreaking = breakingAlerts.length > 0;
  const highImpact = fallbackArticles.filter((a) => (a.trendingScore || 0) >= 10).slice(0, 3);

  if (!hasBreaking && highImpact.length === 0) {
    return (
      <EmptyState
        title="No breaking stories right now"
        description="Live breaking alerts appear here when major stories spike across sources."
        className="py-8"
      />
    );
  }

  if (hasBreaking) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
          Breaking now
        </h2>
        <ul className="space-y-2">
          {breakingAlerts.slice(0, 5).map((alert, index) => (
            <li
              key={`${alert.article?._id}-${index}`}
              className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20"
            >
              {alert.article?._id ? (
                <Link
                  to={articlePath(alert.article._id)}
                  className="text-sm font-semibold text-red-800 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200"
                >
                  {alert.article.title}
                </Link>
              ) : (
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                  {alert.article?.title}
                </p>
              )}
              {alert.reason && (
                <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/70">{alert.reason}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
        High impact
      </h2>
      <div className="space-y-3">
        {highImpact.map((article) => (
          <ArticleCard key={article._id} article={article} showScore />
        ))}
      </div>
    </section>
  );
}

export default BreakingSection;
