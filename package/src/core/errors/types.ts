import { ValidationErrorMap } from './ErrorMap';
import { ValidationSimpleError } from './SimpleError';
import { ValidationArrayError } from './ArrayError';

/**
 * @description Уникальный код ошибки валидации
 */
export type ErrorCode = Symbol;

/**
 * @description Информация, которая есть для каждой ошибки
 */
export type ErrorInfo = {
  code: ErrorCode;
  message: string;
};

/**
 * @description Union возможных ошибок
 */
export type ValidationError =
  | ValidationSimpleError
  | ValidationArrayError
  | ValidationErrorMap;
