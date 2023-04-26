import {
  UniversalCompositionalValidationRule,
  ValidationTypes,
  createContext,
  createRule,
} from '../core';

/**
 * @description Позволяет выключить проверку на required в guard
 * @example object({ name: optional(string(min(22))) })
 */
export const optional = (rule: UniversalCompositionalValidationRule) =>
  createRule<ValidationTypes, unknown>((value, ctx) => {
    const currentCtx = createContext(ctx, value);

    currentCtx.isOptional = true;

    return rule(value, currentCtx);
  });
