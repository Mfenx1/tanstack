import { memo, type ReactNode } from 'react';
import classes from './ErrorBoundary.module.css';

export interface DefaultErrorFallbackProps {
  error: Error;
  reset: () => void;
}

const DefaultErrorFallbackComponent = ({ error, reset }: DefaultErrorFallbackProps): ReactNode => (
  <div className={classes.container} role="alert" aria-live="assertive">
    <h2 className={classes.title}>Что-то пошло не так</h2>
    <p className={classes.message}>{error.message}</p>
    <button type="button" className={classes.button} onClick={reset}>
      Попробовать снова
    </button>
  </div>
);

export const DefaultErrorFallback = memo(DefaultErrorFallbackComponent);
