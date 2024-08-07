import { type ValidationRule, compose, createGuard } from '../core';

import { BOOLEAN_TYPE_ERROR_INFO } from './constants';

/**
 * Guard для boolean. Проверяет значение на тип boolean
 * @param rules - правила, валидирующие boolean или unknown value
 * @example
 * ```ts
 *  const validate = boolean();
 *
 *  // undefined
 *  validate(true);
 * ```
 */
export const boolean = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: ValidationRule<boolean, TLastSchemaValues>[]
) =>
  createGuard<TLastSchemaValues>((value, ctx, { typeErrorMessage }) => {
    if (typeof value !== 'boolean') {
      return ctx.createError({
        ...BOOLEAN_TYPE_ERROR_INFO,
        message: typeErrorMessage || BOOLEAN_TYPE_ERROR_INFO.message,
      });
    }

    return compose<boolean, TLastSchemaValues>(...rules)(value, ctx);
  });
