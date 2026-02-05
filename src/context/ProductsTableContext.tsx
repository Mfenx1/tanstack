import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddProductMutation, useUpdateProductMutation } from '$hooks';
import {
  selectAddingNew,
  setAddingNew,
  setEditing,
  setToast,
  useProductsTableState,
} from '$store';
import { CONTEXT_ERRORS } from '$constants';
import type { Product, SortOrder } from '$types';

export interface ProductsTableContextValue {
  sortBy: string;
  order: SortOrder;
  addingNew: boolean;
  onColumnResize: (col: string, width: number) => void;
  onSort: (col: string) => void;
  onAddClick: () => void;
  onAdd: (payload: {
    title: string;
    price: number;
    brand: string;
    sku: string;
  }) => void;
  onEdit: (
    productId: number,
    patch: Partial<Pick<Product, 'title' | 'price' | 'brand' | 'sku'>>
  ) => void;
}

const ProductsTableContext = createContext<ProductsTableContextValue | null>(null);

export const useProductsTable = (): ProductsTableContextValue => {
  const ctx = useContext(ProductsTableContext);
  if (!ctx) throw new Error(CONTEXT_ERRORS.useProductsTable);
  return ctx;
};

interface ProductsTableProviderProps {
  children: ReactNode;
}

export const ProductsTableProvider = ({ children }: ProductsTableProviderProps) => {
  const dispatch = useDispatch();
  const { sortBy, order, setColumnWidth, setSort } =
    useProductsTableState();
  const addingNew = useSelector(selectAddingNew);

  const addMutation = useAddProductMutation();
  const updateMutation = useUpdateProductMutation();

  const onSort = useCallback(
    (col: string) => {
      const nextOrder: SortOrder =
        sortBy === col ? (order === 'asc' ? 'desc' : 'asc') : 'asc';
      setSort(col, nextOrder);
    },
    [sortBy, order, setSort]
  );

  const onColumnResize = useCallback(
    (col: string, width: number) => {
      setColumnWidth(col, width);
    },
    [setColumnWidth]
  );

  const onAddClick = useCallback(
    () => dispatch(setAddingNew(true)),
    [dispatch]
  );

  const onEdit = useCallback(
    async (
      productId: number,
      patch: Partial<Pick<Product, 'title' | 'price' | 'brand' | 'sku'>>
    ) => {
      try {
        await updateMutation.mutateAsync({ id: productId, patch });
        dispatch(setEditing(null));
      } catch {
        void 0;
      }
    },
    [dispatch, updateMutation]
  );

  const onAdd = useCallback(
    async (payload: {
      title: string;
      price: number;
      brand: string;
      sku: string;
    }) => {
      if (!payload.title.trim()) return;
      if (payload.price <= 0) return;
      if (!payload.brand.trim()) return;
      if (!payload.sku.trim()) return;
      try {
        await addMutation.mutateAsync(payload);
        dispatch(setAddingNew(false));
        dispatch(setToast('Товар успешно добавлен'));
      } catch {
        dispatch(setToast('Ошибка добавления товара'));
      }
    },
    [dispatch, addMutation]
  );

  const value = useMemo<ProductsTableContextValue>(
    () => ({
      sortBy,
      order,
      addingNew,
      onColumnResize,
      onSort,
      onAddClick,
      onAdd,
      onEdit,
    }),
    [
      sortBy,
      order,
      addingNew,
      onColumnResize,
      onSort,
      onAddClick,
      onAdd,
      onEdit,
    ]
  );

  return (
    <ProductsTableContext.Provider value={value}>
      {children}
    </ProductsTableContext.Provider>
  );
};
