import { memo } from 'react';
import classes from './PageSkeleton.module.css';

const PageSkeletonComponent = () => (
  <div className={classes.wrapper} aria-label="Загрузка">
    <div className={classes.header}>
      <div className={classes.headerTitle} />
      <div className={classes.headerActions} />
    </div>
    <div className={classes.content}>
      <div className={classes.contentBar} />
      <div className={classes.contentArea}>
        <div className={classes.block} />
        <div className={classes.block} />
        <div className={classes.block} />
      </div>
    </div>
  </div>
);

export const PageSkeleton = memo(PageSkeletonComponent);
