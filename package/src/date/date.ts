import { type ValidationRule, compose, createGuard } from '../core';

import { DATE_TYPE_ERROR_INFO, INVALID_DATE_ERROR_INFO } from './constants';

type AdditionalDefOptions = {
  invalidDateErrorMessage?: string;
};

/**
 * Guard для Date object. Проверяет значение на соответствие объекту Date и на валидность даты
 * @param rules - правила, валидирующие Date или unknown value
 * @example
 * ```ts
 *  const validate = date();
 *
 *  // undefined
 *  validate(new Date());
 *   // invalid date error
 *  validate(new Date('22.22.2022'));
 * ```
 */
export const date = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: ValidationRule<Date, TLastSchemaValues>[]
) =>
  createGuard<TLastSchemaValues, AdditionalDefOptions>(
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

      return compose<Date, TLastSchemaValues>(...rules)(value, ctx);
    },
  );
