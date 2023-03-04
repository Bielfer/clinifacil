/* eslint react/no-array-index-key:off */
import { gridColsArray } from '@/constants/styles';
import clsx from 'clsx';
import type { FC } from 'react';

type Props = {
  data?: string[][];
};

const TableGrid: FC<Props> = ({ data }) => {
  const firstColumnEmpty =
    Array.isArray(data) && data.every((row) => row?.[0] === '');

  return (
    <div className="px-2 text-center">
      <div
        className={clsx(
          'grid',
          clsx(
            'grid',
            firstColumnEmpty
              ? gridColsArray[data[0].length - 1]
              : gridColsArray[data?.[0].length ?? 0]
          )
        )}
      >
        {data?.[0].map((header: string, idx: number) => (
          <div
            key={header}
            className={clsx(
              'py-3 text-center font-semibold',
              firstColumnEmpty && idx === 0 && 'hidden'
            )}
          >
            {header}
          </div>
        ))}
      </div>
      <div>
        {data?.slice(1).map((row: string[], idxRow: number) => (
          <div
            key={idxRow}
            className={clsx(
              'grid border-t border-gray-300',
              firstColumnEmpty
                ? gridColsArray[row.length - 1]
                : gridColsArray[row.length]
            )}
          >
            {row.map((value, idxCol) => (
              <div
                key={idxCol}
                className={clsx(
                  'py-3 first:font-semibold',
                  firstColumnEmpty && idxCol === 0 && 'hidden'
                )}
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableGrid;
