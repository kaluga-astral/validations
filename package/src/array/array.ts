import {
  type ValidationRule,
  type ValidationTypes,
  compose,
  createGuard,
} from '../core';

import { ARRAY_TYPE_ERROR_INFO } from './constants';

/**
 * @description Guard для массива. Проверяет value на соответствие типу array
 * @param rules - правила валидаций, применяющиеся ко всему массиву
 * @example
 * ```ts
 * const value = ['Vasya', 'Ivan'];
 *
 * const validateArray = array(min(1), arrayItem(string()));
 *
 * // undefined
 * validateArray(value);
 * ```
 */
export const array = <
  TItem extends ValidationTypes,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  ...rules: ValidationRule<Array<TItem>, TLastSchemaValues>[]
) =>
  createGuard<TLastSchemaValues>((value, ctx, { typeErrorMessage }) => {
    if (!Array.isArray(value)) {
      return ctx.createError({
        ...ARRAY_TYPE_ERROR_INFO,
        message: typeErrorMessage || ARRAY_TYPE_ERROR_INFO.message,
      });
    }

    return compose<Array<TItem>, TLastSchemaValues>(...rules)(value, ctx);
  });
