import type { ReactNode } from 'react';
import { ProductsDataProvider } from './ProductsDataContext';
import { ProductsTableProvider } from './ProductsTableContext';

interface ProductsPageProviderProps {
  children: ReactNode;
}

export const ProductsPageProvider = ({ children }: ProductsPageProviderProps) => (
  <ProductsDataProvider>
    <ProductsTableProvider>{children}</ProductsTableProvider>
  </ProductsDataProvider>
);
