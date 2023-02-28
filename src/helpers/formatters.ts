export const formatCurrency = (
  value: number,
  options: { keepZero: boolean } = { keepZero: true }
) => {
  if (value === 0 && !options?.keepZero) return ' - ';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
};

export const formatCPF = (cpf: string) =>
  cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

export const tableFormatters: Record<string, (value: string) => string> = {
  plusSign: (value: string) => {
    let formattedString = value;

    if (!value) return value;

    if (!value.includes(',') && !value.includes('.')) formattedString += ',00';

    if (formattedString.includes('-') || formattedString.includes('+'))
      return formattedString;

    return `+ ${formattedString}`;
  },
  degree: (value: string) => {
    if (!value) return value;

    return value.includes('°') ? value : `${value} °`;
  },
  minusSign: (value: string) => {
    let formattedString = value;

    if (!value) return value;

    if (!value.includes(',') && !value.includes('.')) formattedString += ',00';

    if (formattedString.includes('-')) return formattedString;

    return `- ${formattedString}`;
  },
};
