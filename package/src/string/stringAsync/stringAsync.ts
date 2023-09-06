import {
  AsyncValidationRule,
  ValidationRule,
  composeAsync,
  createAsyncGuard,
} from '../../core';
import { isString } from '../utils';
import { STRING_TYPE_ERROR_INFO } from '../constants';

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
  createAsyncGuard<TLastSchemaValues>(
    async (value, ctx, { typeErrorMessage }) => {
      if (!isString(value)) {
        return ctx.createError({
          ...STRING_TYPE_ERROR_INFO,
          message: typeErrorMessage || STRING_TYPE_ERROR_INFO.message,
        });
      }

      return composeAsync(...rules)(value, ctx);
    },
  );
