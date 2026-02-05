import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ACTIONS_COL_WIDTH,
  COLUMNS,
  FALLBACK_COL_WIDTH,
  ROW_HEIGHT,
  VIRTUAL_OVERSCAN,
} from '$constants';
import { useProductsData, useProductsTable } from '$context';
import { useProductsTableStore } from '$store';
import { useLatest } from '$hooks';
import { parsePriceInput, throttle, validateProductForm } from '$utils';
import { LoadMoreProgress } from '$components';
import { AddProductRow, ColGroup, ColumnHeader, ProductRow } from './components';
import classes from './ProductTable.module.css';

const ProductTableComponent = () => {
  const { products, onLoadMore, hasMore, loadingMore } = useProductsData();
  const {
    onColumnResize,
    onSort,
    sortBy,
    order,
    addingNew,
    onAdd,
  } = useProductsTable();
  const [resizing, setResizing] = useState<string | null>(null);
  const [newRow, setNewRow] = useState({ title: '', price: '', brand: '', sku: '' });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const startX = useRef(0);
  const startW = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useLatest(onLoadMore);
  const hasMoreRef = useLatest(hasMore);
  const loadingMoreRef = useLatest(loadingMore);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: VIRTUAL_OVERSCAN,
    paddingStart: addingNew ? ROW_HEIGHT : 0,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const getWidth = useCallback((col: string) => {
    return useProductsTableStore.getState().columnWidths[col] ?? FALLBACK_COL_WIDTH;
  }, []);

  useEffect(() => {
    if (addingNew) {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [addingNew]);

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const element = scrollContainerRef.current;
        if (!element || !onLoadMoreRef.current || !hasMoreRef.current || loadingMoreRef.current)
          return;
        const { scrollTop, scrollHeight, clientHeight } = element;
        if (scrollHeight - scrollTop - clientHeight < 100) onLoadMoreRef.current();
      }, 80),
    [hasMoreRef, loadingMoreRef, onLoadMoreRef]
  );

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleResizeStart = useCallback(
    (col: string, event: React.MouseEvent) => {
      event.preventDefault();
      setResizing(col);
      startX.current = event.clientX;
      startW.current = getWidth(col);
    },
    [getWidth]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!resizing) return;
      const tableWidth = tableContainerRef.current?.clientWidth ?? 0;
      const availableWidth = Math.max(0, tableWidth - ACTIONS_COL_WIDTH);
      const otherColumnsSum = COLUMNS.filter(({ key }) => key !== resizing).reduce(
        (sum, { key }) => sum + getWidth(key),
        0
      );
      const maxWidth = Math.max(60, availableWidth - otherColumnsSum);
      const deltaX = event.clientX - startX.current;
      const newW = Math.max(60, Math.min(startW.current + deltaX, maxWidth));
      onColumnResize(resizing, newW);
      startX.current = event.clientX;
      startW.current = newW;
    },
    [resizing, onColumnResize, getWidth]
  );

  const handleMouseUp = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleNewRowFieldChange = useCallback(
    (field: keyof typeof newRow) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;
        const value = field === 'price' ? parsePriceInput(raw) : raw;
        setNewRow((prev) => ({ ...prev, [field]: value }));
        setAddErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
      },
    []
  );

  useEffect(() => {
    if (!addingNew) {
      setNewRow({ title: '', price: '', brand: '', sku: '' });
      setAddErrors({});
    }
  }, [addingNew]);

  const handleAddSubmit = useCallback(() => {
    const err = validateProductForm(newRow);
    setAddErrors(err);
    if (Object.keys(err).length > 0) return;
    onAdd({
      title: newRow.title.trim(),
      price: parseFloat(newRow.price),
      brand: newRow.brand.trim(),
      sku: newRow.sku.trim(),
    });
    setNewRow({ title: '', price: '', brand: '', sku: '' });
    setAddErrors({});
  }, [newRow, onAdd]);

  const handleSortClick = useCallback(
    (colKey: string) => () => {
      onSort(colKey);
    },
    [onSort]
  );

  const handleResizeMouseDown = useCallback(
    (colKey: string) => (event: React.MouseEvent) => {
      handleResizeStart(colKey, event);
    },
    [handleResizeStart]
  );

  return (
    <div
      ref={tableContainerRef}
      className={`${classes.tableOuter} ${resizing ? classes.resizing : ''}`}
    >
      <div className={classes.headerWrap}>
        <table className={classes.table}>
          <ColGroup />
          <thead>
            <tr>
              {COLUMNS.map(({ key, label, sortable }) => (
                <ColumnHeader
                  key={key}
                  colKey={key}
                  label={label}
                  sortable={sortable}
                  sortBy={sortBy}
                  order={order}
                  onSortClick={handleSortClick(key)}
                  onResizeMouseDown={handleResizeMouseDown(key)}
                />
              ))}
              <th className={`${classes.th} ${classes.thActions}`} />
            </tr>
          </thead>
        </table>
      </div>
      <div ref={scrollContainerRef} className={classes.bodyWrap}>
        <div
          className={classes.virtualListInner}
          style={{ '--virtual-height': `${totalSize}px` } as React.CSSProperties}
        >
          <table className={classes.table}>
            <ColGroup />
            <tbody>
              {addingNew && (
                <AddProductRow
                  values={newRow}
                  errors={addErrors}
                onTitleChange={handleNewRowFieldChange('title')}
                onBrandChange={handleNewRowFieldChange('brand')}
                onSkuChange={handleNewRowFieldChange('sku')}
                onPriceChange={handleNewRowFieldChange('price')}
                onSubmit={handleAddSubmit}
                />
              )}
              {virtualItems.map((virtualRow, index) => {
                const product = products[virtualRow.index];
                if (!product) return null;
                const offset = addingNew ? ROW_HEIGHT : 0;
                const translateY = virtualRow.start - offset - index * virtualRow.size;
                return (
                  <ProductRow
                    key={product._clientKey ?? product.id}
                    product={product}
                    columns={COLUMNS}
                    height={virtualRow.size}
                    translateY={translateY}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        {loadingMore && <LoadMoreProgress />}
      </div>
    </div>
  );
};

export const ProductTable = memo(ProductTableComponent);
