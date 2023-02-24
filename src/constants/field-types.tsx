/* eslint react/no-array-index-key:off */
import MySwitch from '@/components/core/MySwitch';
import Text from '@/components/core/Text';
import FormikAutocomplete from '@/components/forms/FormikAutocomplete';
import FormikInput from '@/components/forms/FormikInput';
import FormikSwitch from '@/components/forms/FormikSwitch';
import FormikTable from '@/components/forms/FormikTable';
import FormikTextarea from '@/components/forms/FormikTextarea';
import type { HandbookFieldType } from '@prisma/client';
import clsx from 'clsx';
import type { Key } from 'react';
import { gridColsArray } from './styles';

export const fieldTypes = {
  text: 'TEXT',
  autocomplete: 'AUTOCOMPLETE',
  check: 'CHECK',
  textarea: 'TEXTAREA',
  date: 'DATE',
  table: 'TABLE',
} as const;

export const fieldTypesArray = Object.values(
  fieldTypes
) as unknown as readonly [HandbookFieldType, ...HandbookFieldType[]];

export const toRenderField = ({
  field,
  name,
  label,
  key,
  options,
}: {
  key?: Key | null;
  field: HandbookFieldType;
  name: string;
  label?: string | undefined | null;
  options?: { text: string; value: string }[];
}) => {
  const fieldMatcher: Record<HandbookFieldType, JSX.Element> = {
    TEXT: <FormikInput name={name} label={label} key={key} />,
    TEXTAREA: <FormikTextarea name={name} label={label} key={key} />,
    CHECK: <FormikSwitch name={name} label={label} key={key} />,
    AUTOCOMPLETE: (
      <FormikAutocomplete
        name={name}
        label={label}
        key={key}
        options={options ?? []}
      />
    ),
    DATE: (
      <FormikInput name={name} label={label} key={key} formatter="__/__/____" />
    ),
    TABLE: <FormikTable name={name} label={label} key={key} />,
  };

  return fieldMatcher[field];
};

export const showHandbookField = ({
  field,
  label,
  value,
}: {
  key?: Key | null;
  field: HandbookFieldType;
  label?: string | undefined | null;
  value?: any;
}) => {
  const firstColumnEmpty =
    Array.isArray(value) && value.every((row) => row?.[0] === '');

  const fieldMatcher: Record<HandbookFieldType, JSX.Element | null | boolean> =
    {
      TEXT: (
        <>
          {!!label && (
            <Text h4 className="mb-1">
              {label}
            </Text>
          )}
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      TEXTAREA: (
        <>
          {!!label && (
            <Text h4 className="mb-1">
              {label}
            </Text>
          )}
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      CHECK: (
        <>
          {!!label && (
            <Text h4 className="mb-1">
              {label}
            </Text>
          )}
          <MySwitch checked={value} onChange={() => {}} />
        </>
      ),
      AUTOCOMPLETE: (
        <>
          {!!label && (
            <Text h4 className="mb-1">
              {label}
            </Text>
          )}
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      DATE: (
        <>
          {!!label && (
            <Text h4 className="mb-1">
              {label}
            </Text>
          )}
          <Text p>{value}</Text>
        </>
      ),
      TABLE: Array.isArray(value) && (
        <div className="px-2 text-center">
          <div
            className={clsx(
              'grid',
              clsx(
                'grid',
                firstColumnEmpty
                  ? gridColsArray[(value?.[0] as string[]).length - 1]
                  : gridColsArray[value?.[0].length]
              )
            )}
          >
            {value?.[0].map((header: string, idx: number) => (
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
            {value?.slice(1).map((row: string[], idxRow: number) => (
              <div
                key={idxRow}
                className={clsx(
                  'grid border-t border-gray-300',
                  firstColumnEmpty
                    ? gridColsArray[row.length - 1]
                    : gridColsArray[row.length]
                )}
              >
                {row.map((data, idxCol) => (
                  <div
                    key={idxCol}
                    className={clsx(
                      'border-l border-gray-300 py-3 first:border-l-0 first:font-semibold',
                      firstColumnEmpty && idxCol === 0 && 'hidden',
                      firstColumnEmpty && idxCol === 1 && 'border-l-0'
                    )}
                  >
                    {data}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ),
    };

  return fieldMatcher[field];
};
