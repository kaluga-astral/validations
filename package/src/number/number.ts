import { type ValidationRule, compose, createGuard } from '../core';

import {
  INFINITY_NUMBER_ERROR_INFO,
  NAN_NUMBER_ERROR_INFO,
  NUMBER_TYPE_ERROR_INFO,
} from './constants';

type AdditionalDefOptions = {
  nanErrorMessage?: string;
  infinityErrorMessage?: string;
};

/**
 * Guard для number. Проверяет значение на тип number и NaN, Infinity
 * Для NaN и Infinity возвращаются отдельные ошибки
 * @param rules - правила, валидирующие number или unknown value
 * @example
 * ```ts
 *  const validate = number(min(22));
 *
 *  // undefined
 *  validate(24);
 * ```
 */
export const number = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: ValidationRule<number, TLastSchemaValues>[]
) =>
  createGuard<TLastSchemaValues, AdditionalDefOptions>(
    (
      value,
      ctx,
      { typeErrorMessage, nanErrorMessage, infinityErrorMessage },
    ) => {
      if (typeof value !== 'number') {
        return ctx.createError({
          ...NUMBER_TYPE_ERROR_INFO,
          message: typeErrorMessage || NUMBER_TYPE_ERROR_INFO.message,
        });
      }

      if (Number.isNaN(value)) {
        return ctx.createError({
          ...NAN_NUMBER_ERROR_INFO,
          message: nanErrorMessage || NAN_NUMBER_ERROR_INFO.message,
        });
      }

      if (!Number.isFinite(value)) {
        return ctx.createError({
          ...INFINITY_NUMBER_ERROR_INFO,
          message: infinityErrorMessage || INFINITY_NUMBER_ERROR_INFO.message,
        });
      }

      return compose<number, TLastSchemaValues>(...rules)(value, ctx);
    },
  );
