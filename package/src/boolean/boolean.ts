import { ValidationRule, compose, createGuard } from '../core';

import { BOOLEAN_TYPE_ERROR_INFO } from './constants';

/**
 * @description Guard для boolean. Проверяет значение на тип boolean
 * @param rules - правила, валидирующие boolean или unknown value
 * @example
 * ```ts
 *  const validate = boolean();
 *
 *  // undefined
 *  validate(true);
 * ```
 */
export const boolean = <TLastSchemeValues extends Record<string, unknown>>(
  ...rules: ValidationRule<boolean, TLastSchemeValues>[]
) =>
  createGuard<TLastSchemeValues>((value, ctx, { typeErrorMessage }) => {
    if (typeof value !== 'boolean') {
      return ctx.createError({
        ...BOOLEAN_TYPE_ERROR_INFO,
        message: typeErrorMessage || BOOLEAN_TYPE_ERROR_INFO.message,
      });
    }

    return compose<boolean, TLastSchemeValues>(...rules)(value, ctx);
  });
