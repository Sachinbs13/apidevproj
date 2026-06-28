import { cn } from '../../utils/cn.js';

function EmptyState({ title, description, action, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 px-6 text-center dark:border-slate-800 dark:bg-slate-950/30',
        className,
      )}
    >
      <p className="text-base font-semibold text-slate-700 dark:text-slate-300">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
