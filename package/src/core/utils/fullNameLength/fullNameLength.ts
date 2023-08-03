/**
 * @description Проверяет, что длина значения находится в допустимом диапазоне от 1 до 200 символов
 */
export const fullNameLength = (value: string): boolean =>
  value.length < 1 || value.length > 200;
