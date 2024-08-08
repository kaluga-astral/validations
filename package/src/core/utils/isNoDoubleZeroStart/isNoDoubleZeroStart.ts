/**
 * Используется для проверки того, что строка не начинается с '00'
 */
export const isNoDoubleZeroStart = (str: string): boolean =>
  !str.startsWith('00');
