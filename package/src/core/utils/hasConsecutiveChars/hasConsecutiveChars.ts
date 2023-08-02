/**
 * @description Проверяет, что текст не может содержать последовательно два спецсимвола/пробела
 */
export const hasConsecutiveChars = (value: string): boolean =>
  /['’ .,()-]{2}/.test(value);
