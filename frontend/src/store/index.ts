import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './slices/articlesSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
  },
});

// Type helpers for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
