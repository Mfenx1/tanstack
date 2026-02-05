import { memo, useCallback, useState } from 'react';
import type { Product } from '$types';
import { RATING_THRESHOLD, type ProductTableColumn } from '$constants';
import { useProductsTable } from '$context';
import { setEditing } from '$store';
import { useDispatch } from 'react-redux';
import { formatCellValue, getProductValue, parsePriceInput, validateProductForm } from '$utils';
import { ProductRowActions } from '../ProductRowActions';
import classes from './ProductRowEditForm.module.css';

export interface ProductRowEditFormProps {
  product: Product;
  columns: readonly ProductTableColumn[];
}

const ProductRowEditFormComponent = ({ product, columns }: ProductRowEditFormProps) => {
  const isLowRating =
    typeof product.rating === 'number' && product.rating < RATING_THRESHOLD;
  const { onEdit } = useProductsTable();
  const dispatch = useDispatch();
  const onEditingChange = useCallback(
    (id: number | null) => dispatch(setEditing(id != null ? { id } : null)),
    [dispatch]
  );
  const [editValues, setEditValues] = useState({
    title: product.title ?? '',
    brand: product.brand ?? '',
    sku: product.sku ?? '',
    price: product.price != null ? String(product.price) : '',
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const handleSave = useCallback(() => {
    const err = validateProductForm(editValues);
    setEditErrors(err);
    if (Object.keys(err).length > 0) return;
    onEdit(product.id, {
      title: editValues.title,
      brand: editValues.brand,
      sku: editValues.sku,
      price: parseFloat(editValues.price),
    });
    onEditingChange(null);
  }, [product.id, editValues, onEdit, onEditingChange]);

  const handleCancel = useCallback(() => {
    setEditErrors({});
    onEditingChange(null);
  }, [onEditingChange]);

  const handleEditKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') handleSave();
      if (event.key === 'Escape') handleCancel();
    },
    [handleSave, handleCancel]
  );

  const handleFieldChange = useCallback((fieldKey: keyof typeof editValues, rawValue: string) => {
    const value = fieldKey === 'price' ? parsePriceInput(rawValue) : rawValue;
    setEditValues((prev) => ({ ...prev, [fieldKey]: value }));
    setEditErrors((prev) => (prev[fieldKey] ? { ...prev, [fieldKey]: '' } : prev));
  }, []);

  const getFieldChangeHandler = useCallback(
    (fieldKey: keyof typeof editValues) =>
      (event: React.ChangeEvent<HTMLInputElement>) =>
        handleFieldChange(fieldKey, event.target.value),
    [handleFieldChange]
  );

  return (
    <>
      {columns.map(({ key, editable }) => {
        const value = getProductValue(product, key);
        const isRating = key === 'rating';
        const ratingNum =
          isRating && typeof value === 'number' && Number.isFinite(value)
            ? value.toFixed(1)
            : null;

        return (
          <td key={key} className={classes.td}>
            {editable ? (
            <div className={classes.fieldWrap}>
              <input
                value={editValues[key as keyof typeof editValues] ?? ''}
                onChange={getFieldChangeHandler(key as keyof typeof editValues)}
                type="text"
                inputMode={key === 'price' ? 'decimal' : 'text'}
                className={classes.cellInput}
                onKeyDown={handleEditKeyDown}
                aria-invalid={editErrors[key] ? 'true' : 'false'}
                aria-describedby={editErrors[key] ? `edit-${product.id}-${key}-error` : undefined}
              />
              {editErrors[key] && (
                <span
                  id={`edit-${product.id}-${key}-error`}
                  className={classes.tooltipPopover}
                  role="alert"
                >
                  {editErrors[key]}
                </span>
              )}
            </div>
          ) : isRating && ratingNum != null ? (
            <>
              <span className={isLowRating ? classes.lowRatingValue : ''}>{ratingNum}</span>
              /5
            </>
          ) : (
            <span>{formatCellValue(value, key)}</span>
          )}
          </td>
        );
      })}
      <td className={classes.td}>
        <ProductRowActions onSave={handleSave} onCancel={handleCancel} />
      </td>
    </>
  );
};

export const ProductRowEditForm = memo(ProductRowEditFormComponent);
