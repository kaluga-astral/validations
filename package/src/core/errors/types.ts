import { type ValidationErrorMap } from './ErrorMap';
import { type ValidationSimpleError } from './SimpleError';
import { type ValidationArrayError } from './ArrayError';

/**
 * Уникальный код ошибки валидации
 */
export type ErrorCode = string;

/**
 * Информация, которая есть для каждой ошибки
 */
export type ErrorInfo = {
  code: ErrorCode;
  message: string | ((...ars: any) => string);
};

/**
 * Union возможных ошибок
 */
export type ValidationError =
  | ValidationSimpleError
  | ValidationArrayError
  | ValidationErrorMap;
