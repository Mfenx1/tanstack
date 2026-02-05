import { memo } from 'react';
import { useColumnWidth } from '$store';
import classes from './ColGroup.module.css';

interface ColProps {
  colKey: string;
}

const ColComponent = ({ colKey }: ColProps) => {
  const width = useColumnWidth(colKey);
  return (
    <col
      key={colKey}
      className={classes.colResizable}
      style={{ '--col-width': `${width}px`, '--col-min-width': '60px' } as React.CSSProperties}
    />
  );
};

export const Col = memo(ColComponent);
