import ConditionalWrapper from '@/components/core/ConditionalWrapper';
import {
  translateXArray,
  translateXArrayNegative,
  translateYArray,
  translateYArrayNegative,
} from '@/constants/styles';
import type { Printable } from '@prisma/client';
import clsx from 'clsx';
import { forwardRef, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  printable?: Printable | null;
};

const PrintablesLayout = forwardRef<HTMLDivElement, Props>(
  ({ children, printable }, ref) => {
    const backgroundUrl = printable?.backgroundUrl;
    const translateX = (printable && printable.translateX) ?? 0;
    const translateY = (printable && printable.translateY) ?? 0;
    const translateXStyle =
      translateX >= 0
        ? translateXArray[translateX]
        : translateXArrayNegative[-translateX];
    const translateYStyle =
      translateY >= 0
        ? translateYArray[translateY]
        : translateYArrayNegative[-translateY];

    return (
      <>
        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-full overflow-hidden bg-cover bg-center bg-no-repeat',
            !backgroundUrl && 'flex items-center justify-center'
          )}
          style={{ backgroundImage: `url(${backgroundUrl})` }}
          ref={ref}
        >
          <ConditionalWrapper
            condition={!!backgroundUrl}
            renderWrapper={(toRender) => (
              <div
                className={clsx(
                  'absolute top-1/2 left-1/2 h-full w-full',
                  translateXStyle,
                  translateYStyle
                )}
              >
                {toRender}
              </div>
            )}
          >
            {children}
          </ConditionalWrapper>
        </div>
        <style type="text/css" media="print">
          {
            '\
html, body { height: 100%; margin: 0 !important; padding: 0 !important; overflow: hidden; } \
'
          }
        </style>
      </>
    );
  }
);

export default PrintablesLayout;
