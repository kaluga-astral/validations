import { type ValidationErrorMap } from './ErrorMap';
import { type ValidationSimpleError } from './SimpleError';
import { type ValidationArrayError } from './ArrayError';

/**
 * @description Уникальный код ошибки валидации
 */
export type ErrorCode = string;

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
