import { memo, useEffect } from 'react';
import classes from './Toast.module.css';

export interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const ToastComponent = ({ message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timeoutId = setTimeout(onClose, duration);
    return () => clearTimeout(timeoutId);
  }, [onClose, duration]);

  return (
    <div className={classes.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export const Toast = memo(ToastComponent);
