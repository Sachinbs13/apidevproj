import { useReadingHistoryQuery } from '../../queries/useArticleQueries.js';
import ArticleCard from '../ui/ArticleCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

function HistoryList() {
  const { data, isLoading, error } = useReadingHistoryQuery();
  const items = data?.items ?? [];
  const errorMessage = error?.response?.data?.message || error?.message || '';

  if (isLoading) return <LoadingSpinner label="Loading reading history..." />;

  if (errorMessage) {
    return <EmptyState title="Could not load history" description={errorMessage} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No reading history"
        description="Articles you open will appear here automatically."
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map(({ article, viewedAt }) => (
        <div key={`${article._id}-${viewedAt}`}>
          <p className="mb-2 text-xs text-slate-500">
            Viewed {new Date(viewedAt).toLocaleString()}
          </p>
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}

export default HistoryList;
