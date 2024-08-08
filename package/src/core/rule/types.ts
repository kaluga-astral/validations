import { type ValidationContext } from '../context';
import { type ValidationResult } from '../types';

/**
 * Самостоятельное правило для валидации. Может использоваться вне guard'ов
 */
export type IndependentValidationRule<
  TValue,
  TLastSchemaValues extends Record<string, unknown>,
> = (
  value: TValue,
  ctx?: ValidationContext<TLastSchemaValues>,
) => ValidationResult;

/**
 * Самостоятельное асинхронное правило для валидации. Может использоваться вне guard'ов
 */
export type AsyncIndependentValidationRule<
  TValue,
  TLastSchemaValues extends Record<string, unknown>,
> = (
  value: TValue,
  ctx?: ValidationContext<TLastSchemaValues>,
) => Promise<ValidationResult>;

/**
 * Правило для валидации, работающее исключительно с guard'ами
 */
export type ValidationRule<
  TValue,
  TLastSchemaValues extends Record<string, unknown> = {},
> = (
  value: TValue,
  ctx: ValidationContext<TLastSchemaValues>,
) => ValidationResult | ValidationRule<TValue, TLastSchemaValues>;

/**
 * Асинхронное правило для валидации, работающее исключительно с guard'ами
 */
export type AsyncValidationRule<
  TValue,
  TLastSchemaValues extends Record<string, unknown> = {},
> = (
  value: TValue,
  ctx: ValidationContext<TLastSchemaValues>,
) => Promise<
  | ValidationResult
  | AsyncValidationRule<TValue, TLastSchemaValues>
  | ValidationRule<TValue, TLastSchemaValues>
>;

/**
 * Композиционное правило валидации, умеющее работать с любыми значениями.
 * В основном используется для композиционных правил, которые принимают rule, умеющие валидировать разные значения (optional, transform...)
 */
export type UniversalCompositionalValidationRule<
  TLastSchemaValues extends Record<string, unknown>,
> = ValidationRule<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  TLastSchemaValues
>;
