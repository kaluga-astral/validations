import {
  CommonRuleParams,
  createRule,
  fullNameLength,
  hasConsecutiveChars,
  isCheckValidCharacters,
  isStartsWithAndEndsWithLetter,
} from '../core';

import { SURNAME_ERROR_INFO } from './constants';

type SurnameParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валидно ли фамилия
 * @example
 * ```ts
 * const validate = string(surname());
 * validate("Иванов");
 * ```
 */
export const surname = <TLastSchemaValues extends Record<string, unknown>>(
  params?: SurnameParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createSurnameError = () =>
        ctx.createError({
          message: params?.message || SURNAME_ERROR_INFO.message,
          code: SURNAME_ERROR_INFO.code,
        });

      if (fullNameLength(value)) {
        return createSurnameError();
      }

      if (isCheckValidCharacters(value)) {
        return createSurnameError();
      }

      if (isStartsWithAndEndsWithLetter(value)) {
        return createSurnameError();
      }

      if (hasConsecutiveChars(value)) {
        return createSurnameError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
