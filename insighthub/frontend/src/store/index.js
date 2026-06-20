import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import newsReducer from './newsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
  },
});

export default store;
