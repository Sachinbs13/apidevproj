function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-sky-400" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
