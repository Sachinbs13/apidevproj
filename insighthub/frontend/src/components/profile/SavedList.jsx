import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useSavedArticlesQuery } from '../../queries/useArticleQueries.js';
import { unsaveArticle } from '../../api/userApi.js';
import ArticleCard from '../ui/ArticleCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

function SavedList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useSavedArticlesQuery();
  const items = data?.items ?? [];
  const errorMessage = error?.response?.data?.message || error?.message || '';

  async function handleRemove(articleId) {
    try {
      await unsaveArticle(articleId);
      queryClient.invalidateQueries({ queryKey: ['user', 'saved'] });
      toast.success('Removed from saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove article');
    }
  }

  if (isLoading) return <LoadingSpinner label="Loading saved articles..." />;

  if (errorMessage) {
    return <EmptyState title="Could not load saved articles" description={errorMessage} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No saved articles yet"
        description="Tap Save on any article to bookmark it here for later."
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map(({ article, savedAt }) => (
        <div key={article._id} className="relative">
          <p className="mb-2 text-xs text-slate-500">
            Saved {new Date(savedAt).toLocaleString()}
          </p>
          <ArticleCard article={article} />
          <button
            type="button"
            onClick={() => handleRemove(article._id)}
            className="absolute right-4 top-4 rounded-lg border border-slate-300 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-red-400 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default SavedList;
