/**
 * Проверяет, что длина значения находится в допустимом диапазоне от 1 до 200 символов
 */
export const isValidFullNameLength = (value: string): boolean =>
  value.length < 1 || value.length > 200;
