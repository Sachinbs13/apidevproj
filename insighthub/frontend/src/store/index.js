import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import newsReducer, {
  hydrateSubscriptions,
  subscribeCategory,
  subscribeTopic,
  unsubscribeCategory,
  unsubscribeTopic,
  addSubscriptionAlert,
  clearSubscriptionAlerts,
  setSubscriptionAlerts,
} from './newsSlice.js';
import { saveAlertSubscriptions } from '../helpers/alertSubscriptionsStorage.js';
import { saveAlertHistory } from '../helpers/alertHistoryStorage.js';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(
    subscribeTopic,
    unsubscribeTopic,
    subscribeCategory,
    unsubscribeCategory,
    hydrateSubscriptions,
  ),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState();
    const userId = state.auth.user?.id;
    if (!userId) return;

    saveAlertSubscriptions(userId, {
      topics: state.news.subscribedTopics,
      categories: state.news.subscribedCategories,
    });
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(addSubscriptionAlert, clearSubscriptionAlerts, setSubscriptionAlerts),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState();
    const userId = state.auth.user?.id;
    if (!userId) return;
    saveAlertHistory(userId, state.news.subscriptionAlerts);
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export default store;
