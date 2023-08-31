import { ValidationContext } from '../context';
import { ValidationResult } from '../types';

/**
 * @description Самостоятельное правило для валидации. Может использоваться вне guard'ов
 */
export type IndependentValidationRule<
  TValue,
  TLastSchemaValues extends Record<string, unknown>,
> = (
  value: TValue,
  ctx?: ValidationContext<TLastSchemaValues>,
) => ValidationResult;

/**
 * @description Правило для валидации, работающее исключительно с guard'ами
 */
export type ValidationRule<
  TValue,
  TLastSchemaValues extends Record<string, unknown> = {},
> = (
  value: TValue,
  ctx: ValidationContext<TLastSchemaValues>,
) => ValidationResult | ValidationRule<TValue, TLastSchemaValues>;

/**
 * @description Композиционное правило валидации, умеющее работать с любыми значениями.
 * В основном используется для композиционных правил, которые принимают rule, умеющие валидировать разные значения (optional, transform...)
 */
export type UniversalCompositionalValidationRule<
  TLastSchemaValues extends Record<string, unknown>,
> = ValidationRule<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  TLastSchemaValues
>;
