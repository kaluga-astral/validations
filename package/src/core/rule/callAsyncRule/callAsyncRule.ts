import { AsyncValidationRule, ValidationRule } from '../types';
import { ValidationResult } from '../../types';
import { ValidationContext } from '../../context';
import { REJECT_PROMISE_ERROR_INFO } from '../../errors';
import { logger } from '../../logger';

/**
 * Позволяет рекурсивно вызывать асинхронные правила. Rule может возвращать другой rule
 */
export const callAsyncRule = <
  TValue,
  TLastSchemaValues extends Record<string, unknown>,
>(
  rule:
    | ValidationRule<TValue, TLastSchemaValues>
    | AsyncValidationRule<TValue, TLastSchemaValues>,
  value: TValue,
  ctx: ValidationContext<TLastSchemaValues>,
): ValidationResult | Promise<ValidationResult> => {
  const ruleResult = rule(value, ctx);

  if (ruleResult && 'then' in ruleResult) {
    return ruleResult
      .then((result) => {
        if (typeof result === 'function') {
          return callAsyncRule(result, value, ctx);
        }

        return result;
      })
      .catch((err) => {
        logger.error('Ошибка при выполнении асинхронного правила', err);

        return ctx.createError(REJECT_PROMISE_ERROR_INFO);
      });
  }

  return typeof ruleResult === 'function'
    ? callAsyncRule(ruleResult, value, ctx)
    : ruleResult;
};
