import GridTable from '@/components/core/GridTable';
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
          <Text h4 className="mb-1">
            {label}
          </Text>
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      TEXTAREA: (
        <>
          <Text h4 className="mb-1">
            {label}
          </Text>
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      CHECK: (
        <>
          <Text h4 className="mb-1">
            {label}
          </Text>
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      AUTOCOMPLETE: (
        <>
          <Text h4 className="mb-1">
            {label}
          </Text>
          <Text p>{value ?? ' - '}</Text>
        </>
      ),
      DATE: (
        <>
          <Text h4 className="mb-1">
            {label}
          </Text>
          <Text p>{value}</Text>
        </>
      ),
      TABLE: Array.isArray(value) && <GridTable data={value} />,
    };

  return fieldMatcher[field];
};
