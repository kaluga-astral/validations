import { createRule } from '../core';

import { INTEGER_ERROR_INFO } from './constants';

type IntegerParams = {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description
 * Проверяет является ли значение целым числом.
 * @example
 * ```ts
 * const validate = number(integer(5));
 *
 * // undefined
 * validate(5)
 *
 * // undefined
 * validate(7)
 *
 * // { message: 'Только целые числа' }
 * validate(3.14)
 * ```
 */
export const integer = <TLastSchemaValues extends Record<string, unknown>>(
  params?: IntegerParams,
) =>
  createRule<number, TLastSchemaValues>((value, ctx) => {
    if (!Number.isInteger(value)) {
      return ctx.createError({
        message: params?.message || INTEGER_ERROR_INFO.message,
        code: INTEGER_ERROR_INFO.code,
      });
    }

    return undefined;
  });
