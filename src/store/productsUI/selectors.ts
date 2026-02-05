import { createSelector } from '@reduxjs/toolkit';
import type { ProductsUIState } from './productsUISlice';

const selectProductsUI = (state: { productsUI: ProductsUIState }) => state.productsUI;

export const selectSearch = createSelector(
  [selectProductsUI],
  (ui) => ui.search
);

export const selectToast = createSelector(
  [selectProductsUI],
  (ui) => ui.toast
);

export const selectEditing = createSelector(
  [selectProductsUI],
  (ui) => ui.editing
);

export const selectAddingNew = createSelector(
  [selectProductsUI],
  (ui) => ui.addingNew
);
