import {
  type AsyncValidationRule,
  type ValidationRule,
  composeAsync,
  createGuard,
} from '../../core';
import { isString } from '../utils';
import { STRING_TYPE_ERROR_INFO } from '../constants';

// TODO: необходимо реализовать переиспользование логики между string и stringAsync

/**
 * Позволяет использовать для валидации асинхронные правила
 * @example stringAsync(async () => undefined)
 */
export const stringAsync = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: Array<
    | ValidationRule<string, TLastSchemaValues>
    | AsyncValidationRule<string, TLastSchemaValues>
  >
) =>
  createGuard<TLastSchemaValues>(async (value, ctx, { typeErrorMessage }) => {
    if (!isString(value)) {
      return ctx.createError({
        ...STRING_TYPE_ERROR_INFO,
        message: typeErrorMessage || STRING_TYPE_ERROR_INFO.message,
      });
    }

    return composeAsync(...rules)(value, ctx);
  });
