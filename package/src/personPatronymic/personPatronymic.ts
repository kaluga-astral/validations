import {
  type CommonRuleParams,
  createRule,
  isFullNameValidCharacters,
  isHasConsecutiveChars,
  isStartsWithAndEndsWithLetter,
  isValidFullNameLength,
} from '../core';

import { PERSON_PATRONYMIC_ERROR_INFO } from './constants';

type PersonPatronymicParams = CommonRuleParams<string> & {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет валидно ли отчество
 * @example
 * ```ts
 * const validate = string(personPatronymic());
 * validate("Иванович");
 * ```
 */
export const personPatronymic = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: PersonPatronymicParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createPersonPatronymicError = () =>
        ctx.createError({
          message: params?.message || PERSON_PATRONYMIC_ERROR_INFO.message,
          code: PERSON_PATRONYMIC_ERROR_INFO.code,
        });

      if (isValidFullNameLength(value)) {
        return createPersonPatronymicError();
      }

      if (isFullNameValidCharacters(value)) {
        return createPersonPatronymicError();
      }

      if (isStartsWithAndEndsWithLetter(value)) {
        return createPersonPatronymicError();
      }

      if (isHasConsecutiveChars(value)) {
        return createPersonPatronymicError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
