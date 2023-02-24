/* eslint react/no-array-index-key:off */
import { gridColsArray } from '@/constants/styles';
import clsx from 'clsx';
import type { FC } from 'react';

type Props = {
  data: string[][];
};

const GridTable: FC<Props> = ({ data }) => {
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
              ? gridColsArray[(data?.[0] as string[]).length - 1]
              : gridColsArray[data?.[0].length]
          )
        )}
      >
        {data?.[0].map((header: string, idx: number) => (
          <div
            key={header}
            className={clsx(
              'border-l border-gray-300 py-3 text-center font-semibold first:border-l-0',
              firstColumnEmpty && idx === 0 && 'hidden',
              firstColumnEmpty && idx === 1 && 'border-l-0'
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
                  'border-l border-gray-300 py-3 first:border-l-0 first:font-semibold',
                  firstColumnEmpty && idxCol === 0 && 'hidden',
                  firstColumnEmpty && idxCol === 1 && 'border-l-0'
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

export default GridTable;
