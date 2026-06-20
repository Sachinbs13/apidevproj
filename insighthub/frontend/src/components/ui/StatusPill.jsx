import { cn } from '../../utils/cn.js';

const STATUS_STYLES = {
  active: 'border-emerald-800/60 bg-emerald-950/40 text-emerald-400',
  degraded: 'border-amber-800/60 bg-amber-950/40 text-amber-400',
  down: 'border-red-800/60 bg-red-950/40 text-red-400',
};

function StatusPill({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        STATUS_STYLES[status] || 'border-slate-700 bg-slate-800 text-slate-400',
        className,
      )}
    >
      {status}
    </span>
  );
}

export default StatusPill;
