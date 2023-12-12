import {
  type ValidationErrorData,
  ValidationSimpleError,
} from '../SimpleError';
import { type ValidationResult } from '../../types';

/**
 * @description Map, которое содержит результат валидации свойств
 */
export type ErrorMap = Record<string, ValidationResult>;

/**
 * @description Доп. поля для ошибки в объекте
 */
export type ValidationObjectErrorCause = {
  /**
   * @description Map, которое содержит результат валидации свойств
   */
  errorMap: Record<string, ValidationResult>;
};

/**
 * @description Map ошибок для объекта
 */
export class ValidationErrorMap extends ValidationSimpleError<ValidationObjectErrorCause> {
  constructor(
    message: string,
    data: ValidationErrorData<ValidationObjectErrorCause>,
  ) {
    super(message, data);
    this.cause = data.cause;
  }
}
