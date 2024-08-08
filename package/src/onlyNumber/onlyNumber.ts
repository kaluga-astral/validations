import { createRule } from '../core';

import { ONLY_NUMBER_ERROR_CODE } from './constants';

type OnlyNumberParams = {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет на наличие только чисел в строке
 * @example
 * ```ts
 *  const validate = string(onlyNumber());
 *  validate('123');
 * ```
 */
export const onlyNumber = <TLastSchemaValues extends Record<string, unknown>>(
  params?: OnlyNumberParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    const isExtraValues = Boolean(value.replace(/^[0-9]+$/g, ''));

    if (isExtraValues) {
      return ctx.createError({
        code: ONLY_NUMBER_ERROR_CODE,
        message: params?.message || 'Строка должна содержать только числа',
      });
    }

    return undefined;
  });
