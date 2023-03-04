import Text from '@/components/core/Text';
import ConditionalWrapper from '@/components/core/ConditionalWrapper';
import { monthNames } from '@/constants/dates';
import {
  translateXArray,
  translateXArrayNegative,
  translateYArray,
  translateYArrayNegative,
} from '@/constants/styles';
import type { Doctor, Printable } from '@prisma/client';
import clsx from 'clsx';
import { getDate, getMonth, getYear } from 'date-fns';
import { forwardRef, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  printable?: Printable | null;
  doctor?: Doctor | null;
};

const PrintablesLayout = forwardRef<HTMLDivElement, Props>(
  ({ children, printable, doctor }, ref) => {
    const today = new Date();
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
    const shouldBeCentered = translateX === 0 && translateY === 0;

    return (
      <>
        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-full overflow-hidden bg-cover bg-center bg-no-repeat',
            !(!!backgroundUrl && !shouldBeCentered) &&
              'flex items-center justify-center'
          )}
          style={{ backgroundImage: `url(${backgroundUrl})` }}
          ref={ref}
        >
          <ConditionalWrapper
            condition={!!backgroundUrl && !shouldBeCentered}
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
            <div className="flex flex-col items-center">
              {printable?.displayName && (
                <Text b className="justify-center">
                  {printable.name}
                </Text>
              )}
              <div className="my-16 w-full max-w-md px-3">{children}</div>
              {printable?.footer && (
                <div>
                  <Text>
                    {doctor?.city ?? ''}, {getDate(today)} de{' '}
                    {monthNames[getMonth(today)]} de {getYear(today)}
                  </Text>
                  {doctor && (
                    <div className="mt-20 flex flex-col items-center border-t border-gray-900">
                      <Text>Dr. {doctor.name}</Text>
                      <Text>CRM {doctor.crm}</Text>
                    </div>
                  )}
                </div>
              )}
            </div>
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
