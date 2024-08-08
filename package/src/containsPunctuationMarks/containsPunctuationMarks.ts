import { createRule } from '../core';

import { CONTAINS_PUNCTUATION_MARKS_ERROR_CODE } from './constants';

type ContainsPunctuationMarksParams = {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет на наличие в строке знаков пунктуации !$%&’()+,-./:;<=>?@[]^_{|}”
 * @example
 * ```ts
 *  const validate = string(containsPunctuationMarks());
 *  validate('test?');
 * ```
 */
export const containsPunctuationMarks = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: ContainsPunctuationMarksParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    const containsPunctuationMarksRegex =
      /(?=.*[!$%&’”'"()+,-.\/:;<=>?@\[\]^_{|}])/;

    if (!containsPunctuationMarksRegex.test(value)) {
      return ctx.createError({
        code: CONTAINS_PUNCTUATION_MARKS_ERROR_CODE,
        message: params?.message || 'Строка должна содержать знаки пунктуации',
      });
    }

    return undefined;
  });
