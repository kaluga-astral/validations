import { type ValidationRule } from '../types';
import { type ValidationResult } from '../../types';
import { type ValidationContext } from '../../context';

/**
 * Позволяет рекурсивно вызывать правила. Rule может возвращать другой rule
 */
export const callRule = <
  TValue,
  TLastSchemaValues extends Record<string, unknown>,
>(
  rule: ValidationRule<TValue, TLastSchemaValues>,
  value: TValue,
  ctx: ValidationContext<TLastSchemaValues>,
): ValidationResult => {
  const ruleResult = rule(value, ctx);

  return typeof ruleResult === 'function'
    ? callRule(ruleResult, value, ctx)
    : ruleResult;
};
