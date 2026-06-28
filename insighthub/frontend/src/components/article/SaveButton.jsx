import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useSavedStatusQuery, useToggleSaveMutation } from '../../queries/useArticleQueries.js';
import { cn } from '../../utils/cn.js';

function SaveButton({ articleId, className }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { data: saved = false } = useSavedStatusQuery(articleId, isAuthenticated);
  const mutation = useToggleSaveMutation(articleId);

  if (!isAuthenticated) return null;

  async function handleToggle() {
    try {
      await mutation.mutateAsync({ saved });
      toast.success(saved ? 'Removed from saved' : 'Article saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update saved articles');
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={mutation.isPending}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition',
        saved
          ? 'border-amber-500/40 bg-amber-950/30 text-amber-400 hover:bg-amber-950/50'
          : 'border-slate-300 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400',
        mutation.isPending && 'opacity-60',
        className,
      )}
    >
      {saved ? '★ Saved' : '☆ Save'}
    </button>
  );
}

export default SaveButton;
