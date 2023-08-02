/**
 * @description Проверяет, что длина текста минимум 1 символ, максимум 200
 */
export const fullNameLength = (value: string): boolean =>
  value.length < 1 || value.length > 200;
