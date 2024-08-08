import {
  type ValidationErrorData,
  ValidationSimpleError,
} from '../SimpleError';
import { type ValidationResult } from '../../types';

/**
 * Map, которое содержит результат валидации свойств
 */
export type ErrorMap = Record<string, ValidationResult>;

/**
 * Доп. поля для ошибки в объекте
 */
export type ValidationObjectErrorCause = {
  /**
   * Map, которое содержит результат валидации свойств
   */
  errorMap: Record<string, ValidationResult>;
};

/**
 * Map ошибок для объекта
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
