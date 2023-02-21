import FormikAutocomplete from '@/components/forms/FormikAutocomplete';
import FormikInput from '@/components/forms/FormikInput';
import FormikSwitch from '@/components/forms/FormikSwitch';
import FormikTextarea from '@/components/forms/FormikTextarea';
import type { HandbookFieldType } from '@prisma/client';
import type { Key } from 'react';

export const fieldTypes = {
  text: 'TEXT',
  autocomplete: 'AUTOCOMPLETE',
  check: 'CHECK',
  textarea: 'TEXTAREA',
  date: 'DATE',
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
  label: string;
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
  };

  return fieldMatcher[field];
};
