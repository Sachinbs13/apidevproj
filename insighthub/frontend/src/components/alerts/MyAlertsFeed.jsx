import { Link } from 'react-router-dom';
import { articlePath } from '../../constants/routes.js';
import { formatSubscriptionAlertReason } from '../../helpers/alertMatching.js';
import EmptyState from '../ui/EmptyState.jsx';

function MyAlertsFeed({ alerts = [], emptyDescription, limit = 10, onClear }) {
  if (alerts.length === 0) {
    return (
      <EmptyState
        title="No alerts yet"
        description={
          emptyDescription ||
          'Subscribe to presets or keywords above. Matching stories will appear here with live toasts.'
        }
        className="py-8"
      />
    );
  }

  return (
    <section className="space-y-3 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-orange-50/40 p-4 dark:border-amber-500/20 dark:from-amber-950/20 dark:to-slate-950/40">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            My alerts
          </h2>
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
          >
            Clear all
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {alerts.slice(0, limit).map((alert, index) => {
          const reason =
            alert.reason ||
            formatSubscriptionAlertReason({
              matches: alert.matches,
              breakingReason: alert.breakingReason,
            });

          return (
            <li
              key={`${alert.article?._id}-${alert.receivedAt || index}`}
              className="rounded-xl border border-slate-200/80 border-l-4 border-l-amber-500 bg-white p-4 shadow-sm dark:border-slate-800 dark:border-l-amber-500 dark:bg-slate-900/60"
            >
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                {alert.matchLabel || 'Alert'}
              </span>
              {alert.article?._id ? (
                <Link
                  to={articlePath(alert.article._id)}
                  className="mt-2 block text-sm font-semibold leading-snug text-slate-900 hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400"
                >
                  {alert.article.title}
                </Link>
              ) : (
                <p className="mt-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                  {alert.article?.title}
                </p>
              )}
              {reason && (
                <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">{reason}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default MyAlertsFeed;
