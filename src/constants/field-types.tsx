/* eslint react/no-array-index-key:off */
import Table from '@/components/core/Table';
import Text from '@/components/core/Text';
import FormikAutocomplete from '@/components/forms/FormikAutocomplete';
import FormikInput from '@/components/forms/FormikInput';
import FormikSwitch from '@/components/forms/FormikSwitch';
import FormikTable from '@/components/forms/FormikTable';
import FormikTextarea from '@/components/forms/FormikTextarea';
import type { HandbookFieldType } from '@prisma/client';
import type { Key } from 'react';

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

export const toPrintField = ({
  field,
  label,
  value,
}: {
  key?: Key | null;
  field: HandbookFieldType;
  label?: string | undefined | null;
  value?: any;
}) => {
  const fieldMatcher: Record<HandbookFieldType, JSX.Element | null | boolean> =
    {
      TEXT: (
        <>
          <Text label className="mb-1">
            {label}
          </Text>
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      TEXTAREA: (
        <>
          <Text label className="mb-1">
            {label}
          </Text>
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      CHECK: (
        <>
          <Text label className="mb-1">
            {label}
          </Text>
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      AUTOCOMPLETE: (
        <>
          <Text label className="mb-1">
            {label}
          </Text>
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      DATE: (
        <>
          <Text label className="mb-1">
            {label}
          </Text>
          <Text p>{value}</Text>
        </>
      ),
      TABLE: Array.isArray(value) && (
        <>
          <Text h3 className="mb-2 justify-center">
            {label}
          </Text>
          <Table className="w-full px-2 text-center">
            <Table.Head>
              {value?.[0].map((header: string) => (
                <Table.Header
                  key={header}
                  className="border-l border-gray-300 text-center first:border-l-0"
                >
                  {header}
                </Table.Header>
              ))}
            </Table.Head>
            <Table.Body>
              {value?.slice(1).map((row: string[], idxRow: number) => (
                <Table.Row key={idxRow}>
                  {row.map((data, idxCol) => (
                    <Table.Data
                      key={idxCol}
                      className="border-l border-gray-300 first:border-l-0 first:font-semibold"
                    >
                      {data}
                    </Table.Data>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ),
    };

  return fieldMatcher[field];
};
