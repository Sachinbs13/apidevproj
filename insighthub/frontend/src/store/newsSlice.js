import { createSlice } from '@reduxjs/toolkit';

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    liveArticles: [],
    trendingArticles: [],
    breakingAlerts: [],
    subscriptionAlerts: [],
    subscribedTopics: [],
    subscribedCategories: [],
  },
  reducers: {
    addLiveArticle(state, action) {
      const exists = state.liveArticles.some((a) => a._id === action.payload._id);
      if (!exists) {
        state.liveArticles = [action.payload, ...state.liveArticles].slice(0, 50);
      }
    },
    addBreakingAlert(state, action) {
      state.breakingAlerts = [action.payload, ...state.breakingAlerts].slice(0, 20);
    },
    addSubscriptionAlert(state, action) {
      const payload = {
        ...action.payload,
        receivedAt: action.payload.receivedAt || new Date().toISOString(),
      };
      state.subscriptionAlerts = [payload, ...state.subscriptionAlerts].slice(0, 30);
    },
    setSubscriptionAlerts(state, action) {
      state.subscriptionAlerts = action.payload || [];
    },
    setTrendingArticles(state, action) {
      state.trendingArticles = action.payload;
    },
    hydrateSubscriptions(state, action) {
      state.subscribedTopics = action.payload.topics || [];
      state.subscribedCategories = action.payload.categories || [];
    },
    resetSubscriptions(state) {
      state.subscribedTopics = [];
      state.subscribedCategories = [];
      state.subscriptionAlerts = [];
    },
    subscribeCategory(state, action) {
      const category = action.payload.toLowerCase().trim();
      if (!state.subscribedCategories.includes(category)) {
        state.subscribedCategories.push(category);
      }
    },
    unsubscribeCategory(state, action) {
      const category = action.payload.toLowerCase().trim();
      state.subscribedCategories = state.subscribedCategories.filter((c) => c !== category);
    },
    subscribeTopic(state, action) {
      const topic = action.payload.toLowerCase().trim();
      if (!state.subscribedTopics.includes(topic)) {
        state.subscribedTopics.push(topic);
      }
    },
    unsubscribeTopic(state, action) {
      const topic = action.payload.toLowerCase().trim();
      state.subscribedTopics = state.subscribedTopics.filter((t) => t !== topic);
    },
    clearBreakingAlerts(state) {
      state.breakingAlerts = [];
    },
    clearSubscriptionAlerts(state) {
      state.subscriptionAlerts = [];
    },
  },
});

export const {
  addLiveArticle,
  addBreakingAlert,
  addSubscriptionAlert,
  setSubscriptionAlerts,
  setTrendingArticles,
  hydrateSubscriptions,
  resetSubscriptions,
  subscribeCategory,
  unsubscribeCategory,
  subscribeTopic,
  unsubscribeTopic,
  clearBreakingAlerts,
  clearSubscriptionAlerts,
} = newsSlice.actions;

export default newsSlice.reducer;
