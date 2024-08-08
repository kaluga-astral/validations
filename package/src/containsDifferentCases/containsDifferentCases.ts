import { createRule } from '../core';

import { CONTAINS_DIFFERENT_CASES_ERROR_CODE } from './constants';

type ContainsDifferentCasesParams = {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет на наличие в строке символов разных регистров
 * @example
 * ```ts
 *  const validate = string(containsDifferentCases());
 *  validate('testTEST');
 * ```
 */
export const containsDifferentCases = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: ContainsDifferentCasesParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    const containsLowerCaseRegex = /(?=.*[A-ZА-ЯЁ])/;
    const containsUpperCaseRegex = /(?=.*[a-zа-яё])/;

    if (
      !containsLowerCaseRegex.test(value) ||
      !containsUpperCaseRegex.test(value)
    ) {
      return ctx.createError({
        code: CONTAINS_DIFFERENT_CASES_ERROR_CODE,
        message:
          params?.message || 'Строка должна содержать символы разного регистра',
      });
    }

    return undefined;
  });
