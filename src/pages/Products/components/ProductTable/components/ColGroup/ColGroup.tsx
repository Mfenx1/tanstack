import { memo } from 'react';
import { COLUMNS } from '$constants';
import { Col } from './Col';
import classes from './ColGroup.module.css';

const ColGroupComponent = () => (
  <colgroup>
    {COLUMNS.map(({ key }) => (
      <Col key={key} colKey={key} />
    ))}
    <col className={classes.colActions} />
  </colgroup>
);

export const ColGroup = memo(ColGroupComponent);
