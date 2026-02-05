import { memo } from 'react';
import { Check, X } from 'lucide-react';
import classes from './ProductRowActions.module.css';

interface ProductRowActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

const ProductRowActionsComponent = ({ onSave, onCancel }: ProductRowActionsProps) => (
  <div className={classes.actions}>
    <button type="button" onClick={onSave} className={classes.btnSave} aria-label="Сохранить">
      <Check size={16} />
    </button>
    <button type="button" onClick={onCancel} className={classes.btnCancel} aria-label="Отмена">
      <X size={16} />
    </button>
  </div>
);

export const ProductRowActions = memo(ProductRowActionsComponent);
