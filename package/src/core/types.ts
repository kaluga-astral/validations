import { type ValidationError } from './errors';

/**
 * Результат работы валидации
 */
export type ValidationResult = ValidationError | undefined;

/**
 * Доступные для валидации типы value
 */
export type ValidationTypes =
  | unknown
  | object
  | string
  | number
  | Date
  | Array<unknown>;
