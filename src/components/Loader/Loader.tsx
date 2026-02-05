import { memo } from 'react';
import classes from './Loader.module.css';

interface LoaderProps {
  size?: 'default' | 'sm';
}

const LoaderComponent = ({ size = 'default' }: LoaderProps) => (
  <div className={size === 'sm' ? classes.wrapperSm : classes.wrapper}>
    <div className={size === 'sm' ? classes.spinnerSm : classes.spinner} aria-label="Загрузка" />
  </div>
);

export const Loader = memo(LoaderComponent);
