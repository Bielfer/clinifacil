/* eslint react/no-array-index-key:off */
import MySwitch from '@/components/core/MySwitch';
import TableGrid from '@/components/core/TableGrid';
import Text from '@/components/core/Text';
import FormikAdd from '@/components/forms/FormikAdd';
import FormikAutocomplete from '@/components/forms/FormikAutocomplete';
import FormikInput from '@/components/forms/FormikInput';
import FormikSwitch from '@/components/forms/FormikSwitch';
import FormikTable from '@/components/forms/FormikTable';
import FormikTextarea from '@/components/forms/FormikTextarea';
import type { HandbookFieldType } from '@prisma/client';
import type { Key } from 'react';
import type { FieldValue } from '@/types/handbook';

export const fieldTypes = {
  text: 'TEXT',
  autocomplete: 'AUTOCOMPLETE',
  check: 'CHECK',
  textarea: 'TEXTAREA',
  date: 'DATE',
  table: 'TABLE',
  add: 'ADD',
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
  formatters,
}: {
  key?: Key | null;
  field: HandbookFieldType;
  name: string;
  label?: string | undefined | null;
  options?: { text: string; value: string }[];
  formatters?: string[][];
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
    TABLE: (
      <FormikTable
        name={name}
        label={label}
        key={key}
        formatters={formatters}
      />
    ),
    ADD: <FormikAdd label={label} name={name} options={options} key={key} />,
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
  value?: FieldValue;
}) => {
  if (!value) return null;

  const body = (Array.isArray(value) && value.slice(1)) || [];
  const tableValues = body.map((row) => row.slice(1));
  const isEmpty =
    tableValues.length > 0 &&
    tableValues.every(
      (row) => Array.isArray(row) && row.every((item) => item === '')
    );

  if (isEmpty) return null;

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
          <MySwitch checked={value as boolean} onChange={() => {}} />
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
      TABLE: <TableGrid data={value as string[][]} />,
      ADD: Array.isArray(value) && value.some((item) => item !== '') && (
        <ul className="list-disc">
          {value.map((data, idx) => (
            <li key={`${data} ${idx}`}>{data}</li>
          ))}
        </ul>
      ),
    };

  return fieldMatcher[field];
};
