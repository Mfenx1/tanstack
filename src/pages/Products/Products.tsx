import { ProductsPageProvider } from '$context';
import { ProductsHeader, ProductsMainContent, ProductsToast } from './components';
import classes from './Products.module.css';

export const Products = () => (
  <ProductsPageProvider>
    <div className={classes.wrapper}>
      <ProductsHeader />
      <main className={classes.main}>
        <ProductsMainContent />
      </main>
      <ProductsToast />
    </div>
  </ProductsPageProvider>
);
