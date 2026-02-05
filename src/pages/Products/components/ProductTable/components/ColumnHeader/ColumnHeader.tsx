import { memo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useColumnWidth } from '$store';
import { ICON_COLOR_LIGHT } from '$constants';
import classes from '../../ProductTable.module.css';

interface ColumnHeaderProps {
  colKey: string;
  label: string;
  sortable: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
  onSortClick: () => void;
  onResizeMouseDown: (event: React.MouseEvent) => void;
}

const ColumnHeaderComponent = ({
  colKey,
  label,
  sortable,
  sortBy,
  order,
  onSortClick,
  onResizeMouseDown,
}: ColumnHeaderProps) => {
  const width = useColumnWidth(colKey);
  const style = {
    '--col-width': `${width}px`,
    '--col-min-width': '60px',
  } as React.CSSProperties;

  return (
    <th
      className={`${classes.th} ${classes.thResizable}`}
      style={style}
      scope="col"
    >
      {sortable ? (
        <button
          type="button"
          className={classes.sortBtn}
          onClick={onSortClick}
        >
          {label}
          {sortBy === colKey && (
            <span className={classes.sortIcon}>
              {order === 'asc' ? (
                <ChevronUp size={14} color={ICON_COLOR_LIGHT} />
              ) : (
                <ChevronDown size={14} color={ICON_COLOR_LIGHT} />
              )}
            </span>
          )}
        </button>
      ) : (
        <span className={classes.thLabel}>{label}</span>
      )}
      <button
        type="button"
        className={classes.resizeHandle}
        onMouseDown={onResizeMouseDown}
        aria-label={`Изменить ширину столбца ${label}`}
        title="Перетащите для изменения ширины"
      />
    </th>
  );
};

export const ColumnHeader = memo(ColumnHeaderComponent);
