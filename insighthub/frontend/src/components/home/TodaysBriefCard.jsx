import { useState } from 'react';
import { useTodayBrief } from '../../hooks/useTodayBrief.js';
import { useBriefSpeech } from '../../hooks/useBriefSpeech.js';
import BriefDigestContent from './BriefDigestContent.jsx';
import { cn } from '../../utils/cn.js';
import SkeletonCard from '../ui/SkeletonCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

function TodaysBriefCard() {
  const { brief, loading, error, lang, occupation, refetch } = useTodayBrief();
  const [lengthMode, setLengthMode] = useState('2min');
  const [expanded, setExpanded] = useState(true);

  const displayText = lengthMode === '2min' ? brief?.digest2Min : brief?.digest5Min;
  const { isPlaying, progress, supported, toggle } = useBriefSpeech(displayText || '', lang);

  if (loading && !brief) {
    return <SkeletonCard />;
  }

  if (error && !brief) {
    return (
      <EmptyState
        title="Today's Brief unavailable"
        description={error}
        action={
          <button
            type="button"
            onClick={refetch}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!brief?.digest2Min && !brief?.digest5Min) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-50 to-indigo-50 shadow-lg dark:border-sky-500/20 dark:from-slate-950 dark:to-sky-950/30">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sky-400/10 blur-2xl" />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-sky-200/60 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex flex-1 items-center justify-between text-left sm:justify-start sm:gap-3"
          >
            <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
              Today&apos;s Brief
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:ml-auto">
              {occupation || brief.occupation}
              {lang !== 'English' && ` · ${lang}`}
            </span>
            <span className="text-xs text-sky-600 dark:text-sky-400 sm:hidden">
              {expanded ? 'Hide' : 'Show'}
            </span>
          </button>
        </div>

        {expanded && (
          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex rounded-xl border border-sky-200/50 bg-white/70 p-1 dark:border-slate-800 dark:bg-slate-900/50">
                <button
                  type="button"
                  onClick={() => setLengthMode('2min')}
                  className={cn(
                    'flex-1 rounded-lg py-2 text-center text-xs font-bold transition',
                    lengthMode === '2min'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400',
                  )}
                >
                  2-min summary
                </button>
                <button
                  type="button"
                  onClick={() => setLengthMode('5min')}
                  className={cn(
                    'flex-1 rounded-lg py-2 text-center text-xs font-bold transition',
                    lengthMode === '5min'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400',
                  )}
                >
                  5-min deep dive
                </button>
              </div>

              <BriefDigestContent content={displayText} />
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-sky-200/50 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="space-y-2">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  Listen
                </span>
                <p className="text-xs text-slate-500">
                  {supported
                    ? `Reads your ${lengthMode === '2min' ? '2-minute' : '5-minute'} digest aloud using browser text-to-speech (${lang}).`
                    : 'Text-to-speech is not supported in this browser.'}
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex h-10 items-end justify-center gap-1.5">
                  {[8, 14, 22, 10, 28, 16, 24, 12, 20, 18].map((barHeight, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-1 rounded-full bg-sky-500/70 transition-all duration-300',
                        isPlaying ? 'animate-pulse' : '',
                      )}
                      style={{
                        height: isPlaying ? `${barHeight}px` : '4px',
                      }}
                    />
                  ))}
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  disabled={!supported || !displayText}
                  className={cn(
                    'w-full rounded-lg py-2.5 text-xs font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50',
                    isPlaying
                      ? 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                      : 'bg-sky-600 text-white hover:bg-sky-500',
                  )}
                >
                  {isPlaying ? 'Stop' : 'Listen'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TodaysBriefCard;
