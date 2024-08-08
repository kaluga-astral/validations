import { type ErrorMap } from '../../core';

/**
 * Проверяет есть ли errorMap ошибки
 */
export const isEmptyErrors = (errorMap: ErrorMap) =>
  Object.values(errorMap).every((error) => error === undefined);
