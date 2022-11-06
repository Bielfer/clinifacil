const testPlaceholders = {
  error: 'Something wrong happened',
  hint: 'Just a hint',
  name: 'simpleName',
  label: 'Just a simple label',
  children: 'Just a simple text',
};

export const getTestPlaceholders = (type: keyof typeof testPlaceholders) =>
  testPlaceholders[type];

export const temp = {};
