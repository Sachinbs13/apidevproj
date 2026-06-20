import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useSocket } from '../hooks/useSocket.js';
import { subscribeTopic, unsubscribeTopic } from '../store/newsSlice.js';
import { cn } from '../utils/cn.js';

function Alerts() {
  const dispatch = useDispatch();
  const { connected, isReady, subscribeToTopic, unsubscribeFromTopic } = useSocket();
  const subscribedTopics = useSelector((state) => state.news.subscribedTopics);
  const breakingAlerts = useSelector((state) => state.news.breakingAlerts);
  const [input, setInput] = useState('');

  function handleSubscribe(e) {
    e.preventDefault();
    const topic = input.trim().toLowerCase();
    if (!topic) return;

    if (!isReady) {
      toast.error('Connect to live feed first (sign in required)');
      return;
    }

    dispatch(subscribeTopic(topic));
    subscribeToTopic(topic);
    setInput('');
    toast.success(`Subscribed to "${topic}"`);
  }

  function handleUnsubscribe(topic) {
    dispatch(unsubscribeTopic(topic));
    unsubscribeFromTopic(topic);
    toast.success(`Unsubscribed from "${topic}"`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Topic Alerts</h1>
        <p className="mt-1 text-sm text-slate-400">
          Subscribe to keywords and get live article pushes via WebSocket
        </p>
      </div>

      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border px-4 py-3 text-sm',
          isReady
            ? 'border-emerald-800/40 bg-emerald-950/20 text-emerald-400'
            : 'border-slate-800 bg-slate-900/50 text-slate-400',
        )}
      >
        <span
          className={cn('h-2 w-2 rounded-full', connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600')}
        />
        {isReady ? 'WebSocket connected — alerts active' : 'Sign in to enable live topic alerts'}
      </div>

      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Topic keyword (e.g. climate, AI, sports)"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-600"
        />
        <button
          type="submit"
          disabled={!isReady}
          className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Subscribe
        </button>
      </form>

      {subscribedTopics.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-slate-400">Active subscriptions</h2>
          <div className="flex flex-wrap gap-2">
            {subscribedTopics.map((topic) => (
              <span
                key={topic}
                className="flex items-center gap-2 rounded-full border border-sky-800/60 bg-sky-950/30 px-3 py-1 text-sm text-sky-400"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => handleUnsubscribe(topic)}
                  className="text-sky-600 hover:text-sky-300"
                  aria-label={`Unsubscribe from ${topic}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {breakingAlerts.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-red-400">Recent breaking alerts</h2>
          <ul className="space-y-2">
            {breakingAlerts.slice(0, 5).map((alert, i) => (
              <li
                key={`${alert.article?._id}-${i}`}
                className="rounded-lg border border-red-900/40 bg-red-950/20 p-3"
              >
                <a
                  href={alert.article?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-red-300 hover:text-red-200"
                >
                  {alert.article?.title}
                </a>
                <p className="mt-1 text-xs text-red-400/70">{alert.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Alerts;
