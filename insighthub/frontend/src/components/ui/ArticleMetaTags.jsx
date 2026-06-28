import { cn } from '../../utils/cn.js';
import { resolveCategoryLabel, resolveLocationLabel } from '../../helpers/articleMeta.js';

function PinIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function TagIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  );
}

function LocationTag({ label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-300">
      <PinIcon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}

function CategoryTag({ label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-violet-800 dark:border-violet-500/20 dark:bg-violet-950/40 dark:text-violet-300">
      <TagIcon className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}

function ArticleMetaTags({ article, className }) {
  const locationLabel = resolveLocationLabel(article);
  const categoryLabel = resolveCategoryLabel(article);

  if (!locationLabel && !categoryLabel) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {locationLabel && <LocationTag label={locationLabel} />}
      {categoryLabel && <CategoryTag label={categoryLabel} />}
    </div>
  );
}

export default ArticleMetaTags;
