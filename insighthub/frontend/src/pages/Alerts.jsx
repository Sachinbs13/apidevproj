import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import AlertPresets from '../components/alerts/AlertPresets.jsx';
import AlertsQuickStart from '../components/alerts/AlertsQuickStart.jsx';
import MyAlertsFeed from '../components/alerts/MyAlertsFeed.jsx';
import { useSocket } from '../hooks/useSocket.js';
import { subscribeTopic, unsubscribeTopic, clearSubscriptionAlerts } from '../store/newsSlice.js';
import { cn } from '../utils/cn.js';

function Alerts() {
  const dispatch = useDispatch();
  const { connected, isReady, subscribeToTopic, unsubscribeFromTopic } = useSocket();
  const subscribedTopics = useSelector((state) => state.news.subscribedTopics);
  const subscribedCategories = useSelector((state) => state.news.subscribedCategories);
  const subscriptionAlerts = useSelector((state) => state.news.subscriptionAlerts);
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  function handleUnsubscribeTopic(topic) {
    dispatch(unsubscribeTopic(topic));
    unsubscribeFromTopic(topic);
    toast.success(`Unsubscribed from "${topic}"`);
  }

  const activeCount = subscribedTopics.length + subscribedCategories.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alerts</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Get live pushes for topics that matter to you
        </p>
      </div>

      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border px-4 py-3 text-sm',
          isReady
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/20 dark:text-emerald-400'
            : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400',
        )}
      >
        <span
          className={cn('h-2 w-2 rounded-full', connected ? 'animate-pulse bg-emerald-500' : 'bg-slate-400')}
        />
        {isReady ? 'Live alerts active' : 'Sign in to enable live alerts'}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Quick presets
        </h2>
        <AlertPresets />
        {activeCount > 0 && (
          <p className="text-xs text-slate-500">{activeCount} active subscription(s)</p>
        )}
      </section>

      {activeCount === 0 && isReady && <AlertsQuickStart />}

      <section>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
        >
          {showAdvanced ? 'Hide custom keyword' : 'Add custom keyword'}
        </button>

        {showAdvanced && (
          <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Custom keyword (e.g. climate, election)"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!isReady}
              className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>

      {subscribedTopics.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">Custom keywords</h2>
          <div className="flex flex-wrap gap-2">
            {subscribedTopics.map((topic) => (
              <span
                key={topic}
                className="flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/30 dark:text-sky-400"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => handleUnsubscribeTopic(topic)}
                  className="text-sky-500 hover:text-sky-700 dark:hover:text-sky-300"
                  aria-label={`Unsubscribe from ${topic}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      <MyAlertsFeed
        alerts={subscriptionAlerts}
        limit={10}
        onClear={subscriptionAlerts.length > 0 ? () => dispatch(clearSubscriptionAlerts()) : undefined}
        emptyDescription={
          activeCount > 0
            ? 'Waiting for stories that match your subscriptions. New matches will toast and appear here.'
            : 'Subscribe to presets or keywords above. Matching stories will appear here with live toasts.'
        }
      />
    </div>
  );
}

export default Alerts;
