import { useState } from 'react';
import toast from 'react-hot-toast';
import { INDIAN_STATES, STATE_CITIES } from '../../constants/indianStates.js';
import { useLocalNews } from '../../hooks/useLocalNews.js';
import { detectUserState } from '../../helpers/geolocation.js';
import ArticleCard from '../ui/ArticleCard.jsx';
import Select from '../ui/Select.jsx';
import SkeletonCard from '../ui/SkeletonCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

function LocalNewsSection({ defaultState, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [state, setState] = useState(defaultState || 'Karnataka');
  const [city, setCity] = useState('');
  const [detecting, setDetecting] = useState(false);

  const cities = STATE_CITIES[state] || [];
  const { articles, loading, error, refetch } = useLocalNews(state, city, {
    limit: 6,
    enabled: expanded && state !== 'National',
  });

  async function handleDetectLocation() {
    setDetecting(true);
    try {
      const guessed = await detectUserState();
      if (guessed && guessed !== 'National') {
        setState(guessed);
        setCity('');
        setExpanded(true);
        toast.success(`Location set to ${guessed}`);
      } else {
        toast.error('Could not detect your state. Please select manually.');
      }
    } finally {
      setDetecting(false);
    }
  }

  return (
    <section
      id="local-news"
      className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/30"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">Local News</h2>
          <p className="text-xs text-slate-500">
            Headlines from {state}
            {city ? ` · ${city}` : ''}
          </p>
        </div>
        <span className="text-xs text-sky-600 dark:text-sky-400">
          {expanded ? 'Hide' : 'Show'}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            <Select
              variant="compact"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity('');
              }}
            >
              {INDIAN_STATES.filter((s) => s !== 'National').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            {cities.length > 0 && (
              <Select
                variant="compact"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">All cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            )}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detecting}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-sky-400 hover:text-sky-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400"
            >
              {detecting ? 'Detecting...' : 'Detect location'}
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              title="Could not load local news"
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
          ) : articles.length === 0 ? (
            <EmptyState
              title={city ? `No stories in ${city}` : `No local stories in ${state}`}
              description="Articles appear here when ingested content is tagged with regional metadata for your selection."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default LocalNewsSection;
