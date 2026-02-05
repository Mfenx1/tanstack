import { configureStore } from '@reduxjs/toolkit';
import { productsUISlice } from './productsUI';

export const store = configureStore({
  reducer: {
    productsUI: productsUISlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
