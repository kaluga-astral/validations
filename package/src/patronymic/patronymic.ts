import {
  CommonRuleParams,
  createRule,
  fullNameLength,
  hasConsecutiveChars,
  isCheckValidCharacters,
  isStartsWithAndEndsWithLetter,
} from '../core';

import { PATRONYMIC_ERROR_INFO } from './constants';

type PatronymicParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валидно ли отчество
 * @example
 * ```ts
 * const validate = string(patronymic());
 * validate("Иванович");
 * ```
 */
export const patronymic = <TLastSchemaValues extends Record<string, unknown>>(
  params?: PatronymicParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createPatronymicError = () =>
        ctx.createError({
          message: params?.message || PATRONYMIC_ERROR_INFO.message,
          code: PATRONYMIC_ERROR_INFO.code,
        });

      if (fullNameLength(value)) {
        return createPatronymicError();
      }

      if (isCheckValidCharacters(value)) {
        return createPatronymicError();
      }

      if (isStartsWithAndEndsWithLetter(value)) {
        return createPatronymicError();
      }

      if (hasConsecutiveChars(value)) {
        return createPatronymicError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
