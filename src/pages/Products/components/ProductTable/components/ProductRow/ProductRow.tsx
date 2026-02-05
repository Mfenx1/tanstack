import { memo, useCallback } from 'react';
import type { Product } from '$types';
import { RATING_THRESHOLD, type ProductTableColumn } from '$constants';
import { selectEditing, setEditing } from '$store';
import { useDispatch, useSelector } from 'react-redux';
import { formatCellValue, getProductValue } from '$utils';
import { ProductRowEditForm } from '../ProductRowEditForm';
import classes from './ProductRow.module.css';

interface ProductRowProps {
  product: Product;
  columns: readonly ProductTableColumn[];
  height: number;
  translateY: number;
}

const ProductRowComponent = ({ product, columns, height, translateY }: ProductRowProps) => {
  const editing = useSelector(selectEditing);
  const dispatch = useDispatch();
  const onEditingChange = useCallback(
    (id: number | null, clientKey?: string) =>
      dispatch(setEditing(id != null ? { id, clientKey } : null)),
    [dispatch]
  );

  const handleCellClick = useCallback(
    (productId: number, clientKey?: string) => () => {
      onEditingChange(productId, clientKey);
    },
    [onEditingChange]
  );

  const handleCellKeyDown = useCallback(
    (productId: number, clientKey?: string) => (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') onEditingChange(productId, clientKey);
    },
    [onEditingChange]
  );

  const isRowEditing =
    editing != null &&
    editing.id === product.id &&
    (product._clientKey == null || editing.clientKey === product._clientKey);
  const isLowRating =
    typeof product.rating === 'number' && product.rating < RATING_THRESHOLD;

  return (
    <tr
      className={`${classes.tr} ${classes.trVirtual} ${isRowEditing ? classes.editingRow : ''}`}
      style={
        {
          '--row-height': `${height}px`,
          '--translate-y': `${translateY}px`,
        } as React.CSSProperties
      }
    >
      {isRowEditing ? (
        <ProductRowEditForm key={product.id} product={product} columns={columns} />
      ) : (
        columns.map(({ key, editable }) => {
          const value = getProductValue(product, key);
          const isRating = key === 'rating';
          const ratingNum =
            isRating && typeof value === 'number' && Number.isFinite(value)
              ? value.toFixed(1)
              : null;

          return (
            <td key={key} className={classes.td}>
              <span
                className={editable ? classes.editable : ''}
                onClick={editable ? handleCellClick(product.id, product._clientKey) : undefined}
                onDoubleClick={editable ? handleCellClick(product.id, product._clientKey) : undefined}
                role={editable ? 'button' : undefined}
                tabIndex={editable ? 0 : undefined}
                onKeyDown={editable ? handleCellKeyDown(product.id, product._clientKey) : undefined}
              >
                {isRating && ratingNum != null ? (
                  <>
                    <span className={isLowRating ? classes.lowRatingValue : ''}>{ratingNum}</span>
                    /5
                  </>
                ) : (
                  formatCellValue(value, key)
                )}
              </span>
            </td>
          );
        })
      )}
      {!isRowEditing && <td className={classes.td} />}
    </tr>
  );
};

export const ProductRow = memo(ProductRowComponent);
