// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user-slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;