import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { ALERT_PRESETS } from '../../constants/alertPresets.js';
import { useSocket } from '../../hooks/useSocket.js';
import { subscribeCategory, subscribeTopic } from '../../store/newsSlice.js';

const STARTER_PRESET = ALERT_PRESETS.find((preset) => preset.id === 'technology') || ALERT_PRESETS[1];

function AlertsQuickStart() {
  const dispatch = useDispatch();
  const { isReady, subscribeToTopic, subscribeToCategory } = useSocket();

  function handleQuickSubscribe() {
    if (!isReady) {
      toast.error('Sign in and wait for live connection');
      return;
    }

    if (STARTER_PRESET.type === 'category') {
      dispatch(subscribeCategory(STARTER_PRESET.value));
      subscribeToCategory(STARTER_PRESET.value);
    } else {
      dispatch(subscribeTopic(STARTER_PRESET.value));
      subscribeToTopic(STARTER_PRESET.value);
    }

    toast.success(`Subscribed to ${STARTER_PRESET.label} — you'll get alerts for matching stories`);
  }

  return (
    <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50/50 p-4 dark:border-sky-800/50 dark:bg-sky-950/20">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        New here? Try a preset to start receiving filtered live alerts.
      </p>
      <button
        type="button"
        onClick={handleQuickSubscribe}
        disabled={!isReady}
        className="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Subscribe to {STARTER_PRESET.label}
      </button>
    </div>
  );
}

export default AlertsQuickStart;
