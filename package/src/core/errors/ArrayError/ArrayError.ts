import { type ValidationResult } from '../../types';
import {
  type ValidationErrorData,
  ValidationSimpleError,
} from '../SimpleError';

/**
 * @description Доп. поля для ошибок элементов массива
 */
export type ValidationArrayErrorCause = {
  /**
   * @description Массив ошибок элементов валидируемого массива.
   * Индекс errorArray соответвует индексу валидируемого элемента массива
   */
  errorArray: Array<ValidationResult>;
};

/**
 * @description Array ошибок для массива
 */
export class ValidationArrayError extends ValidationSimpleError<ValidationArrayErrorCause> {
  constructor(
    message: string,
    data: ValidationErrorData<ValidationArrayErrorCause>,
  ) {
    super(message, data);
    this.cause = data.cause;
  }
}
