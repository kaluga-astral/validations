import { ValidationResult } from './types';

/**
 * @description Уникальный код ошибки валидации
 */
type ErrorCode = Symbol;

/**
 * @description Информация, которая есть для каждой ошибки
 */
type ErrorInfo = {
  code: ErrorCode;
  message: string;
};

/**
 * @description Причина ошибки валидации
 */
type ValidationErrorData<AddCause extends Record<string, unknown>> = {
  cause: AddCause & {
    code: ErrorCode;
  };
};

/**
 * @description Простая ошибка правил валидации. Не имеет вложенных ошибок
 */
export class ValidationSimpleError<
  AddCause extends Record<string, unknown> = {},
> extends Error {
  cause: ValidationErrorData<AddCause>['cause'];

  constructor(message: string, data: ValidationErrorData<AddCause>) {
    super(message);
    this.cause = data.cause;
  }
}

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
export class ValidationObjectError extends ValidationSimpleError<ValidationObjectErrorCause> {
  constructor(
    message: string,
    data: ValidationErrorData<ValidationObjectErrorCause>,
  ) {
    super(message, data);
    this.cause = data.cause;
  }
}

/**
 * @description Доп. поля для ошибок элементов массива
 */
type ValidationArrayErrorCause = {
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

/**
 * @description Фабрика ошибок
 */
export type CreateSimpleError = (errorInfo: ErrorInfo) => ValidationSimpleError;

/**
 * @description Union возможных ошибок
 */
export type ValidationError =
  | ValidationSimpleError
  | ValidationArrayError
  | ValidationObjectError;

export const OBJECT_TYPE_ERROR_INFO: ErrorInfo = {
  code: Symbol('object'),
  message: 'Не является объектом',
};

export const STRING_TYPE_ERROR_INFO: ErrorInfo = {
  code: Symbol('string'),
  message: 'Не является строкой',
};

export const REQUIRED_ERROR_INFO: ErrorInfo = {
  code: Symbol('required'),
  message: 'Обязательно',
};

/**
 * @description Код ошибки для кейса, когда какая-то часть объекта не валидна
 */
export const OBJECT_SHAPE_ERROR_CODE = Symbol('object-shape');
