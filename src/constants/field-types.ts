export const fieldTypes = {
  text: 'TEXT',
  autocomplete: 'AUTOCOMPLETE',
  check: 'CHECK',
  textarea: 'TEXTAREA',
  date: 'DATE',
} as const;

export const fieldTypesArray = Object.values(
  fieldTypes
) as unknown as readonly [FieldType, ...FieldType[]];

type FieldType = typeof fieldTypes[keyof typeof fieldTypes];
