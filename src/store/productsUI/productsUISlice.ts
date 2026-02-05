import { createSlice } from '@reduxjs/toolkit';

export interface EditingState {
  id: number;
  clientKey?: string;
}

export interface ProductsUIState {
  search: string;
  toast: string | null;
  editing: EditingState | null;
  addingNew: boolean;
}

const initialState: ProductsUIState = {
  search: '',
  toast: null,
  editing: null,
  addingNew: false,
};

export const productsUISlice = createSlice({
  name: 'productsUI',
  initialState,
  reducers: {
    setSearch: (state, action: { payload: string }) => {
      state.search = action.payload;
    },
    setToast: (state, action: { payload: string | null }) => {
      state.toast = action.payload;
    },
    setEditing: (state, action: { payload: EditingState | null }) => {
      state.editing = action.payload;
    },
    setAddingNew: (state, action: { payload: boolean }) => {
      state.addingNew = action.payload;
    },
  },
});

export const { setSearch, setToast, setEditing, setAddingNew } = productsUISlice.actions;
