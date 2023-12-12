import { type ValidationError } from './errors';

/**
 * @description Результат работы валидации
 */
export type ValidationResult = ValidationError | undefined;

/**
 * @description Доступные для валидации типы value
 */
export type ValidationTypes =
  | unknown
  | object
  | string
  | number
  | Date
  | Array<unknown>;
