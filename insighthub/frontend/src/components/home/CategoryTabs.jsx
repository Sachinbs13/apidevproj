import { HOME_CATEGORIES } from '../../constants/categories.js';
import { cn } from '../../utils/cn.js';

function CategoryTabs({ activeId, onChange, disabled }) {
  return (
    <div className="sticky top-[57px] z-30 -mx-1 border-b border-slate-200 bg-slate-50/95 pb-3 pt-1 backdrop-blur-md dark:border-slate-900 dark:bg-slate-950/90">
      <div className="flex gap-2 overflow-x-auto px-1 scrollbar-thin">
        {HOME_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-xs font-bold transition',
              activeId === cat.id
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'border border-slate-300 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryTabs;
