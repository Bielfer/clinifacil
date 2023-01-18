const validations = {
  email: 'Insira um email válido',
  required: 'Campo obrigatório',
  valueGreaterThanZero: 'Insira um valor maior que 0',
  isNumberValid: 'Use ponto em vez de vírgula',
  minCharacters: (num: number) =>
    `Esse campo deve conter mais de ${num} caracteres`,
  exactCharacters: (num: number) =>
    `Esse campo deve conter exatamente ${num} caracteres`,
  cellphone: 'O número de celular deve ter 9 dígitos',
  minValue: (num: number) => `Insira um valor maior que ${num}`,
} as const;

export default validations;
