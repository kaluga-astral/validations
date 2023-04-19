import { CreateSimpleError, ValidationError } from './errors';

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
  createError: CreateSimpleError;
};

/**
 * @description Результат работы валидации
 */
export type ValidationResult = ValidationError | undefined;

/**
 * @description Правило для валидации. Может содержать в прототипе meta информацию для advanced валидации
 */
export type ValidationRule<TValue, TValues> = (
  value: TValue,
  ctx: ValidationContext<TValues>,
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
