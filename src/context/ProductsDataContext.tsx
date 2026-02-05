import { createContext, useContext, type ReactNode } from 'react';
import { useProductsQuery } from '$hooks';
import { CONTEXT_ERRORS } from '$constants';
import type { Product } from '$types';

export interface ProductsDataContextValue {
  products: Product[];
  total: number;
  loading: boolean;
  errorMessage: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onRefetch: () => void;
}

const ProductsDataContext = createContext<ProductsDataContextValue | null>(null);

export const useProductsData = (): ProductsDataContextValue => {
  const ctx = useContext(ProductsDataContext);
  if (!ctx) throw new Error(CONTEXT_ERRORS.useProductsData);
  return ctx;
};

interface ProductsDataProviderProps {
  children: ReactNode;
}

export const ProductsDataProvider = ({ children }: ProductsDataProviderProps) => {
  const value = useProductsQuery();
  return (
    <ProductsDataContext.Provider value={value}>
      {children}
    </ProductsDataContext.Provider>
  );
};
