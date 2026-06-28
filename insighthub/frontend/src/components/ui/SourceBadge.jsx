function NewspaperIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M6.75 7.5h3v3h-3v-3Z"
      />
    </svg>
  );
}

function SourceBadge({ name, className }) {
  if (!name) return null;

  return (
    <span
      title={`Publisher: ${name}`}
      className={
        className ||
        'inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300'
      }
    >
      <NewspaperIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
      {name}
    </span>
  );
}

export default SourceBadge;
