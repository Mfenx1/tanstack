import { Filter, Plus, RotateCw } from 'lucide-react';
import { ProductsTableSkeleton } from '$components';
import { ICON_COLOR_LIGHT } from '$constants';
import { useProductsData, useProductsTable } from '$context';
import { ProductTable } from '../ProductTable';
import classes from './ProductsMainContent.module.css';

export const ProductsMainContent = () => {
  const { loading, errorMessage, products, onRefetch } = useProductsData();
  const { addingNew, onAddClick } = useProductsTable();

  const sectionBar = (
    <div className={classes.sectionBar}>
      <h2 className={classes.sectionTitle}>Все позиции</h2>
      <div className={classes.toolbar}>
        <button type="button" className={classes.iconBtn} aria-label="Обновить">
          <RotateCw size={20} color={ICON_COLOR_LIGHT} />
        </button>
        <button type="button" className={classes.iconBtn} aria-label="Фильтр">
          <Filter size={20} color={ICON_COLOR_LIGHT} />
        </button>
        <button type="button" onClick={onAddClick} className={classes.addBtn}>
          <Plus size={18} />
          Добавить
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        {sectionBar}
        <div className={classes.tableArea}>
          <ProductsTableSkeleton />
        </div>
      </>
    );
  }
  if (errorMessage) {
    return (
      <>
        {sectionBar}
        <div className={classes.errorState}>
          <p className={classes.errorText}>{errorMessage}</p>
          <button type="button" onClick={onRefetch} className={classes.retryBtn}>
            Повторить
          </button>
        </div>
      </>
    );
  }
  if (products.length === 0 && !addingNew) {
    return (
      <>
        {sectionBar}
        <div className={classes.emptyState}>
          <p className={classes.emptyText}>Нет товаров</p>
        </div>
      </>
    );
  }
  return (
    <>
      {sectionBar}
      <div className={classes.tableArea}>
        <ProductTable />
      </div>
    </>
  );
};
