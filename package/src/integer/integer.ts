import { createRule } from '../core';

import { INTEGER_ERROR_INFO } from './constants';

type IntegerParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

const isInteger = (value: number): boolean => value === Math.floor(value);

/**
 * @description
 * Проверяет является ли значение целым числом.
 * @example
 * ```ts
 * const validate = number(integer());
 * validate(5);
 * ```
 */
export const integer = <TValues>(params?: IntegerParams) =>
  createRule<number, TValues>((value, ctx) => {
    if (!isInteger(value)) {
      return ctx.createError({
        message: params?.message || INTEGER_ERROR_INFO.message,
        code: INTEGER_ERROR_INFO.code,
      });
    }

    return undefined;
  });
