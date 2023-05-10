import { ValidationSimpleError } from '../SimpleError';
import { ValidationResult } from '../../types';

export type ValidationErrorMap = ValidationSimpleError & {
  /**
   * @description Map, которое содержит результат валидации свойств
   */
  errorMap: Record<string, ValidationResult>;
};
