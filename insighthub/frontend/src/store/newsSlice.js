import { createSlice } from '@reduxjs/toolkit';

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    liveArticles: [],
    breakingAlerts: [],
    subscribedTopics: [],
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
    setTrendingArticles(state, action) {
      state.liveArticles = action.payload;
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
  },
});

export const {
  addLiveArticle,
  addBreakingAlert,
  setTrendingArticles,
  subscribeTopic,
  unsubscribeTopic,
  clearBreakingAlerts,
} = newsSlice.actions;

export default newsSlice.reducer;
