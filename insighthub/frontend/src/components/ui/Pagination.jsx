import { cn } from '../../utils/cn.js';

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasPrev, hasNext } = pagination;

  const buttonClass = (enabled) =>
    cn(
      'inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition',
      enabled
        ? 'border-slate-300 bg-white text-slate-800 shadow-sm hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:bg-sky-950/40 dark:hover:text-sky-300'
        : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600',
    );

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        className={buttonClass(hasPrev)}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Previous
      </button>

      <span className="min-w-[7rem] text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
        Page <span className="text-sky-600 dark:text-sky-400">{page}</span> of {totalPages}
      </span>

      <button
        type="button"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        className={buttonClass(hasNext)}
      >
        Next
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
