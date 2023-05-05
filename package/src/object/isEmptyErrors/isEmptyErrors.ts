import { ValidationErrorMap } from '../../core';

/**
 * @description Проверяет есть ли errorMap ошибки
 */
export const isEmptyErrors = (errorMap: ValidationErrorMap['errorMap']) =>
  Object.values(errorMap).every((error) => error === undefined);
