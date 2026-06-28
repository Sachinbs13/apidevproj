import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ALERT_PRESETS } from '../../constants/alertPresets.js';
import { useSocket } from '../../hooks/useSocket.js';
import {
  subscribeTopic,
  unsubscribeTopic,
  subscribeCategory,
  unsubscribeCategory,
} from '../../store/newsSlice.js';
import { cn } from '../../utils/cn.js';

function AlertPresets() {
  const dispatch = useDispatch();
  const { isReady, subscribeToTopic, unsubscribeFromTopic, subscribeToCategory, unsubscribeFromCategory } =
    useSocket();
  const subscribedTopics = useSelector((state) => state.news.subscribedTopics);
  const subscribedCategories = useSelector((state) => state.news.subscribedCategories);

  function isPresetActive(preset) {
    if (preset.type === 'category') {
      return subscribedCategories.includes(preset.value);
    }
    return subscribedTopics.includes(preset.value);
  }

  function handleToggle(preset) {
    if (!isReady) {
      toast.error('Sign in and wait for live connection');
      return;
    }

    const active = isPresetActive(preset);

    if (preset.type === 'category') {
      if (active) {
        dispatch(unsubscribeCategory(preset.value));
        unsubscribeFromCategory(preset.value);
        toast.success(`Unsubscribed from ${preset.label}`);
      } else {
        dispatch(subscribeCategory(preset.value));
        subscribeToCategory(preset.value);
        toast.success(`Subscribed to ${preset.label}`);
      }
      return;
    }

    if (active) {
      dispatch(unsubscribeTopic(preset.value));
      unsubscribeFromTopic(preset.value);
      toast.success(`Unsubscribed from ${preset.label}`);
    } else {
      dispatch(subscribeTopic(preset.value));
      subscribeToTopic(preset.value);
      toast.success(`Subscribed to ${preset.label}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALERT_PRESETS.map((preset) => {
        const active = isPresetActive(preset);
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleToggle(preset)}
            disabled={!isReady}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
              active
                ? 'bg-sky-600 text-white'
                : 'border border-slate-300 text-slate-700 hover:border-sky-400 dark:border-slate-700 dark:text-slate-300',
            )}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

export default AlertPresets;
