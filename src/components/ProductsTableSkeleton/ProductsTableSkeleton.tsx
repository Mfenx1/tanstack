import { memo } from 'react';
import { COLUMNS, DEFAULT_WIDTHS, ROW_HEIGHT } from '$constants';
import tableClasses from '$pages/Products/components/ProductTable/ProductTable.module.css';
import classes from './ProductsTableSkeleton.module.css';

const ROWS = 12;

const ProductsTableSkeletonComponent = () => (
  <div className={tableClasses.tableOuter}>
    <div className={tableClasses.headerWrap}>
      <table className={tableClasses.table}>
        <colgroup>
          {COLUMNS.map(({ key }) => (
            <col
              key={key}
              className={tableClasses.colResizable}
              style={
                {
                  '--col-width': `${DEFAULT_WIDTHS[key] ?? 120}px`,
                  '--col-min-width': '60px',
                } as React.CSSProperties
              }
            />
          ))}
          <col className={tableClasses.colActions} />
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map(({ key, label }) => (
              <th
                key={key}
                className={`${tableClasses.th} ${tableClasses.thResizable}`}
                scope="col"
              >
                <span className={tableClasses.thLabel}>{label}</span>
              </th>
            ))}
            <th className={`${tableClasses.th} ${tableClasses.thActions}`} />
          </tr>
        </thead>
      </table>
    </div>
    <div className={tableClasses.bodyWrap}>
      <table className={tableClasses.table}>
        <colgroup>
          {COLUMNS.map(({ key }) => (
            <col
              key={key}
              className={tableClasses.colResizable}
              style={
                {
                  '--col-width': `${DEFAULT_WIDTHS[key] ?? 120}px`,
                  '--col-min-width': '60px',
                } as React.CSSProperties
              }
            />
          ))}
          <col className={tableClasses.colActions} />
        </colgroup>
        <tbody>
          {Array.from({ length: ROWS }, (_, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${tableClasses.tr} ${classes.trSkeleton}`}
              style={
                {
                  '--row-height': `${ROW_HEIGHT}px`,
                } as React.CSSProperties
              }
            >
              {COLUMNS.map(({ key }) => (
                <td key={key} className={tableClasses.td}>
                  <div
                    className={classes.cellSkeleton}
                    style={{ width: key === 'title' ? '80%' : key === 'rating' ? '50%' : '65%' }}
                  />
                </td>
              ))}
              <td className={tableClasses.td} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const ProductsTableSkeleton = memo(ProductsTableSkeletonComponent);
