import { memo } from 'react';
import classes from './LoadMoreProgress.module.css';

const LoadMoreProgressComponent = () => (
  <div className={classes.loadMoreProgress}>
    <div className={classes.loadMoreProgressBar} />
  </div>
);

export const LoadMoreProgress = memo(LoadMoreProgressComponent);
