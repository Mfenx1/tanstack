import type React from 'react';
import { memo, useCallback } from 'react';
import { EMPTY_CELL } from '$constants';
import { ProductRowActions } from '../ProductRowActions';
import { setAddingNew } from '$store';
import { useDispatch } from 'react-redux';
import classes from './AddProductRow.module.css';

interface AddProductRowProps {
  values: { title: string; price: string; brand: string; sku: string };
  errors: Record<string, string>;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBrandChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSkuChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const AddProductRowComponent = ({
  values,
  errors,
  onTitleChange,
  onBrandChange,
  onSkuChange,
  onPriceChange,
  onSubmit,
}: AddProductRowProps) => {
  const dispatch = useDispatch();
  const onAddCancel = useCallback(() => dispatch(setAddingNew(false)), [dispatch]);
  return (
    <tr className={classes.addRow}>
      <td className={classes.td}>
        <div className={classes.fieldWrap}>
          <input
            value={values.title}
            onChange={onTitleChange}
            placeholder="Наименование"
            className={classes.cellInput}
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'add-title-error' : undefined}
          />
          {errors.title && (
            <span id="add-title-error" className={classes.tooltipPopover} role="alert">
              {errors.title}
            </span>
          )}
        </div>
      </td>
      <td className={classes.td}>
        <div className={classes.fieldWrap}>
          <input
            value={values.brand}
            onChange={onBrandChange}
            placeholder="Вендор"
            className={classes.cellInput}
            aria-invalid={errors.brand ? 'true' : 'false'}
            aria-describedby={errors.brand ? 'add-brand-error' : undefined}
          />
          {errors.brand && (
            <span id="add-brand-error" className={classes.tooltipPopover} role="alert">
              {errors.brand}
            </span>
          )}
        </div>
      </td>
      <td className={classes.td}>
        <div className={classes.fieldWrap}>
          <input
            value={values.sku}
            onChange={onSkuChange}
            placeholder="Артикул"
            className={classes.cellInput}
            aria-invalid={errors.sku ? 'true' : 'false'}
            aria-describedby={errors.sku ? 'add-sku-error' : undefined}
          />
          {errors.sku && (
            <span id="add-sku-error" className={classes.tooltipPopover} role="alert">
              {errors.sku}
            </span>
          )}
        </div>
      </td>
      <td className={classes.td}>{EMPTY_CELL}</td>
      <td className={classes.td}>
        <div className={classes.fieldWrap}>
          <input
            type="text"
            inputMode="decimal"
            value={values.price}
            onChange={onPriceChange}
            placeholder="Цена"
            className={classes.cellInput}
            aria-invalid={errors.price ? 'true' : 'false'}
            aria-describedby={errors.price ? 'add-price-error' : undefined}
          />
          {errors.price && (
            <span id="add-price-error" className={classes.tooltipPopover} role="alert">
              {errors.price}
            </span>
          )}
        </div>
      </td>
      <td className={classes.td}>{EMPTY_CELL}</td>
      <td className={classes.td}>
        <ProductRowActions onSave={onSubmit} onCancel={onAddCancel} />
      </td>
    </tr>
  );
};

export const AddProductRow = memo(AddProductRowComponent);
