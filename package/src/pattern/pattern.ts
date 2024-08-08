import { createRule } from '../core';

import { PATTERN_ERROR_CODE } from './constants';

type PatternParams = {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет строку на соответствие регулярному выражению.
 * @param regex - регулярное выражение
 * @example
 * ```ts
 * string(pattern(/word/g))
 *
 * string(pattern(/[0-9]/))
 * ```
 */
export const pattern = <TLastSchemaValues extends Record<string, unknown>>(
  regex: RegExp,
  params?: PatternParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    if (!regex.test(value)) {
      return ctx.createError({
        code: PATTERN_ERROR_CODE,
        message:
          params?.message ||
          `Должно подходить под регулярное выражение: "${regex}"`,
      });
    }

    return undefined;
  });
