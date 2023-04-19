/**
 * @description Уникальный код ошибки валидации
 */
export type ErrorCode = Symbol;

/**
 * @description Информация, которая есть для каждой ошибки
 */
export type ErrorInfo = {
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
 * @description Ошибка правил валидации
 */
export class ValidationError<
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
export class ValidationObjectError extends ValidationError<ValidationObjectErrorCause> {
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
export class ValidationArrayError extends ValidationError<ValidationArrayErrorCause> {
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
export type CreateError = (errorInfo: ErrorInfo) => ValidationError;

/**
 * @description Контекст, который доступен в каждом правиле
 */
export type ValidationContext<TValues> = {
  /**
   * @description Значения, которые валидируется guard самого высоко порядка
   */
  values: TValues;
  /**
   * @description Флаг, указывающий на то, что guard должен выключить проверку на required
   */
  isOptional: boolean;
  /**
   * @description Фабрика ошибок. Возвращает новую ошибку валидации
   */
  createError: CreateError;
};

/**
 * @description Результат работы валидации
 */
export type ValidationResult =
  | ValidationError
  | ValidationObjectError
  | ValidationArrayError
  | undefined;

/**
 * @description Правило для валидации. Может содержать в прототипе meta информацию для advanced валидации
 */
export type ValidationRule<TValue, TValues> = (
  value: TValue,
  ctx?: ValidationContext<TValues>,
) => ValidationResult;

/**
 * @description Доступные для валидации типы value
 */
export type ValidationTypes = unknown | object | string | number | Date;

/**
 * @description Правило валидации, умеющее работать с любыми значениями.
 * В основном используется для композиционных правил, которые принимают rule, умеющие валидировать разные значения (optional, transform...)
 */
export type UniversalValidationRule<TValues = unknown> = ValidationRule<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  TValues
>;
