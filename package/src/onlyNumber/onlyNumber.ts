import { createRule } from '../core';

import { ONLY_NUMBER_ERROR_CODE } from './constants';

type OnlyNumberParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет на наличие только чисел в строке
 * @example
 * ```ts
 *  const validate = string(onlyNumber());
 *  validate('123');
 * ```
 */
export const onlyNumber = <TValues>(params?: OnlyNumberParams) =>
  createRule<string, TValues>((value, ctx) => {
    const isExtraValues = Boolean(value.replace(/^[0-9]+$/g, ''));

    if (isExtraValues) {
      return ctx.createError({
        code: ONLY_NUMBER_ERROR_CODE,
        message: params?.message || 'Строка должна содержать только числа',
      });
    }

    return undefined;
  });
