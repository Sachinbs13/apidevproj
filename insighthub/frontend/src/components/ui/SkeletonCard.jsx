function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 dark:border-slate-800">
      <div className="flex gap-4">
        <div className="hidden h-20 w-28 shrink-0 rounded-lg bg-slate-800 sm:block" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-800/80" />
          <div className="h-3 w-2/3 rounded bg-slate-800/80" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-16 rounded-full bg-slate-800" />
            <div className="h-5 w-24 rounded-full bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
