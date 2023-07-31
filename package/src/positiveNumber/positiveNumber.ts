import { createRule } from '../core';

import { POSITIVE_NUMBER_ERROR_INFO } from './constants';

type PositiveNumberParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

const isPositiveNumber = (number: number): boolean => {
  return number > 0;
};

/**
 * @description
 * Проверяет является ли значение положительным числом.
 * @example
 * ```ts
 * const validate = number(positiveNumber(3));
 *
 * // undefined
 * validate(3)
 *
 * // { message: 'Только положительное числа' }
 * validate(0)
 *
 * // { message: 'Только положительное числа' }
 * validate(-1)
 * ```
 */
export const positiveNumber = <
  TLastSchemeValues extends Record<string, unknown>,
>(
  params?: PositiveNumberParams,
) =>
  createRule<number, TLastSchemeValues>((value, ctx) => {
    if (!isPositiveNumber(value)) {
      return ctx.createError({
        message: params?.message || POSITIVE_NUMBER_ERROR_INFO.message,
        code: POSITIVE_NUMBER_ERROR_INFO.code,
      });
    }

    return undefined;
  });
