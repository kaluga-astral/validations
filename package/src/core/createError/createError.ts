import { CreateSimpleError, ValidationSimpleError } from '../errors';

/**
 * @description Создает ошибки валидации
 */
export const createError: CreateSimpleError = ({ message, code }) =>
  new ValidationSimpleError(message, { cause: { code } });
