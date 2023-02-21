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
