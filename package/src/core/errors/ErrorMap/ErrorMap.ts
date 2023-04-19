import { ValidationErrorData, ValidationSimpleError } from '../SimpleError';
import { ValidationResult } from '../../types';

/**
 * @description Доп. поля для ошибки в объекте
 */
type ValidationObjectErrorCause = {
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
