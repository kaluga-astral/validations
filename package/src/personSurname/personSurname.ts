import {
  type CommonRuleParams,
  createRule,
  isFullNameValidCharacters,
  isHasConsecutiveChars,
  isStartsWithAndEndsWithLetter,
  isValidFullNameLength,
} from '../core';

import { PERSON_SURNAME_ERROR_INFO } from './constants';

type PersonSurnameParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валидно ли фамилия
 * @example
 * ```ts
 * const validate = string(personSurname());
 * validate("Иванов");
 * ```
 */
export const personSurname = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: PersonSurnameParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createPersonSurnameError = () =>
        ctx.createError({
          message: params?.message || PERSON_SURNAME_ERROR_INFO.message,
          code: PERSON_SURNAME_ERROR_INFO.code,
        });

      if (isValidFullNameLength(value)) {
        return createPersonSurnameError();
      }

      if (isFullNameValidCharacters(value)) {
        return createPersonSurnameError();
      }

      if (isStartsWithAndEndsWithLetter(value)) {
        return createPersonSurnameError();
      }

      if (isHasConsecutiveChars(value)) {
        return createPersonSurnameError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
