import { createRule } from '../core';

import { CONTAINS_NUMBERS_ERROR_CODE } from './constants';

type ContainsNumbersParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет на наличие чисел в строке
 * @example
 * ```ts
 *  const validate = string(containsNumbers());
 *  validate('test123');
 * ```
 */
export const containsNumbers = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: ContainsNumbersParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    const containsNumbersRegex = /\d/;

    if (!containsNumbersRegex.test(value)) {
      return ctx.createError({
        code: CONTAINS_NUMBERS_ERROR_CODE,
        message: params?.message || 'Строка должна содержать числа',
      });
    }

    return undefined;
  });
