const validations = {
  email: 'Insira um email válido',
  required: 'Campo obrigatório',
  valueGreaterThanZero: 'Insira um valor maior que 0',
  isNumberValid: 'Use ponto em vez de vírgula',
  minCharacters: (num: number) =>
    `Esse campo deve conter mais de ${num} caracteres`,
} as const;

export default validations;
