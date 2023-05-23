import { ValidationContext } from '../context';
import { ValidationResult } from '../types';

/**
 * @description Самостоятельное правило для валидации. Может использоваться вне guard'ов
 */
export type IndependentValidationRule<TValue, TValues> = (
  value: TValue,
  ctx?: ValidationContext<TValues>,
) => ValidationResult;

/**
 * @description Правило для валидации, работающее исключительно с guard'ами
 */
export type ValidationRule<TValue, TValues> = (
  value: TValue,
  ctx: ValidationContext<TValues>,
) => ValidationResult;

/**
 * @description Композиционное правило валидации, умеющее работать с любыми значениями.
 * В основном используется для композиционных правил, которые принимают rule, умеющие валидировать разные значения (optional, transform...)
 */
export type UniversalCompositionalValidationRule<TValues = unknown> =
  ValidationRule<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    TValues
  >;
