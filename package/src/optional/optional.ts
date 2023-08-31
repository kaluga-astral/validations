import {
  IndependentValidationRule,
  ValidationRule,
  createContext,
} from '../core';

/**
 * @description Выключает проверку на required в guard
 * @example object({ name: optional(string(min(22))) })
 */
export const optional =
  <TLastSchemaValues extends Record<string, unknown>>(
    rule: ValidationRule<unknown, TLastSchemaValues>,
  ): IndependentValidationRule<unknown, TLastSchemaValues> =>
  (value, ctx) =>
    rule(value, createContext(ctx, value, { isOptional: true }));
