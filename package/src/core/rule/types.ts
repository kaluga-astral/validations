import { ValidationContext } from '../context';
import { ValidationResult } from '../types';

/**
 * @description Правило для валидации. Может содержать в прототипе meta информацию для advanced валидации
 */
export type ValidationRule<TValue, TValues> = (
  value: TValue,
  ctx?: ValidationContext<TValues>,
) => ValidationResult;

/**
 * @description Правило валидации, умеющее работать с любыми значениями.
 * В основном используется для композиционных правил, которые принимают rule, умеющие валидировать разные значения (optional, transform...)
 */
export type UniversalValidationRule<TValues = unknown> = ValidationRule<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  TValues
>;
