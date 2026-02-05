import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { FALLBACK_COL_WIDTH } from '$constants';
import { createColumnWidthsSlice, createSortSlice } from './slices';
import type { ColumnWidthsSlice, SortSlice } from './slices';

export type ProductsTableStore = ColumnWidthsSlice & SortSlice;

export const useProductsTableStore = create<ProductsTableStore>()(
  devtools(
    immer((set) => ({
      ...createColumnWidthsSlice(set as (p: unknown, ...a: unknown[]) => void),
      ...createSortSlice(set as (p: unknown, ...a: unknown[]) => void),
    })),
    { name: 'ProductsTable' }
  )
);

export const useProductsTableSort = () =>
  useProductsTableStore(useShallow((s) => ({ sortBy: s.sortBy, order: s.order })));

export const useProductsTableState = () =>
  useProductsTableStore(
    useShallow((s) => ({
      sortBy: s.sortBy,
      order: s.order,
      setColumnWidth: s.setColumnWidth,
      setSort: s.setSort,
    }))
  );

export const useColumnWidth = (col: string) =>
  useProductsTableStore((s) => s.columnWidths[col] ?? FALLBACK_COL_WIDTH);
