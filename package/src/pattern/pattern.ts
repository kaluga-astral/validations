import { createRule } from '../core';

import { PATTERN_ERROR_CODE } from './constants';

type PatternParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет строку на соответствие регулярному выражению.
 * @param regex - регулярное выражение
 * @example
 * ```ts
 * string(pattern(/word/g))
 *
 * string(pattern(/[0-9]/))
 * ```
 */
export const pattern = <TValues>(regex: RegExp, params?: PatternParams) =>
  createRule<string, TValues>((value, ctx) => {
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
