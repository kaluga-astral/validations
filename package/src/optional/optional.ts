import {
  type IndependentValidationRule,
  type ValidationRule,
  callRule,
  createContext,
} from '../core';

/**
 * Выключает проверку на required в guard
 * @example object({ name: optional(string(min(22))) })
 */
export const optional =
  <TLastSchemaValues extends Record<string, unknown>>(
    rule: ValidationRule<unknown, TLastSchemaValues>,
  ): IndependentValidationRule<unknown, TLastSchemaValues> =>
  (value, ctx) =>
    callRule(rule, value, createContext(ctx, value, { isOptional: true }));
