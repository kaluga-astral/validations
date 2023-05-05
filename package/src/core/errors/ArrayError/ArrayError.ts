import { ValidationResult } from '../../types';
import { ValidationSimpleError } from '../SimpleError';

export type ValidationArrayError = ValidationSimpleError & {
  /**
   * @description Массив ошибок элементов валидируемого массива.
   * Индекс errorArray соответвует индексу валидируемого элемента массива
   */
  errorArray: Array<ValidationResult>;
};
