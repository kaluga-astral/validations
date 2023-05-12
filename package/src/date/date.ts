import { CompositionalValidationRule, compose, createGuard } from '../core';

import { DATE_TYPE_ERROR_INFO, INVALID_DATE_ERROR_INFO } from './constants';

type AdditionalDefOptions = {
  invalidDateErrorMessage?: string;
};

/**
 * @description Guard для boolean. Проверяет значение на тип boolean
 * @param rules - правила, валидирующие number или unknown value
 * @example
 * ```ts
 *  const validate = boolean();
 *
 *  // undefined
 *  validate(true);
 * ```
 */
export const date = <TValues>(
  ...rules: CompositionalValidationRule<Date, TValues>[]
) =>
  createGuard<Date, TValues, AdditionalDefOptions>(
    (value, ctx, { typeErrorMessage, invalidDateErrorMessage }) => {
      if (!(value instanceof Date)) {
        return ctx.createError({
          ...DATE_TYPE_ERROR_INFO,
          message: typeErrorMessage || DATE_TYPE_ERROR_INFO.message,
        });
      }

      if (Number.isNaN(Number(value))) {
        return ctx.createError({
          ...INVALID_DATE_ERROR_INFO,
          message: invalidDateErrorMessage || INVALID_DATE_ERROR_INFO.message,
        });
      }

      return compose<Date, TValues>(...rules)(value, ctx);
    },
  );
