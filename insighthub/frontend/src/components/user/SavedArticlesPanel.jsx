import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useSavedArticlesQuery, useToggleSaveMutation } from '../../queries/useArticleQueries.js';
import { articlePath } from '../../constants/routes.js';
import { cn } from '../../utils/cn.js';

function SavedArticlesPanel({ open, onClose }) {
  const panelRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { data, isLoading } = useSavedArticlesQuery(1, 8, { enabled: open && isAuthenticated });
  const items = data?.items || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2.5 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mb-3 border-b border-slate-200 pb-2 dark:border-slate-800">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Saved articles
        </h3>
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto">
        {isLoading ? (
          <p className="py-6 text-center text-xs text-slate-500">Loading saved articles…</p>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500">
            No saved articles yet. Tap ☆ Save on any story.
          </p>
        ) : (
          items.map(({ article }) => (
            <SavedRow key={article._id} article={article} onNavigate={onClose} />
          ))
        )}
      </div>
    </div>
  );
}

function SavedRow({ article, onNavigate }) {
  const mutation = useToggleSaveMutation(article._id);

  async function handleUnsave() {
    try {
      await mutation.mutateAsync({ saved: true });
      toast.success('Removed from saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not unsave article');
    }
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="min-w-0 flex-1">
        <Link
          to={articlePath(article._id)}
          onClick={onNavigate}
          className="line-clamp-2 text-xs font-semibold text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400"
        >
          {article.title}
        </Link>
      </div>
      <button
        type="button"
        onClick={handleUnsave}
        disabled={mutation.isPending}
        className={cn(
          'shrink-0 text-xs text-amber-600 hover:text-amber-500 dark:text-amber-400',
          mutation.isPending && 'opacity-50',
        )}
        aria-label="Remove from saved"
      >
        ×
      </button>
    </div>
  );
}

export default SavedArticlesPanel;
