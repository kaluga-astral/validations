/**
 * @description Используется для проверки того, состоит ли строка целиком из 0
 */
export const isStringOfZeros = (value: string) => {
  if (value) {
    return !Boolean(value.replace(/0/g, ''));
  }

  return false;
};
