import {
  type CommonRuleParams,
  createRule,
  isFullNameValidCharacters,
  isHasConsecutiveChars,
  isStartsWithAndEndsWithLetter,
  isValidFullNameLength,
} from '../core';

import { PERSON_NAME_ERROR_INFO } from './constants';

type PersonNameParams = CommonRuleParams<string> & {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет валидно ли имя
 * @example
 * ```ts
 * const validate = string(personName());
 * validate("Иван");
 * ```
 */
export const personName = <TLastSchemaValues extends Record<string, unknown>>(
  params?: PersonNameParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createPersonNameError = () =>
        ctx.createError({
          message: params?.message || PERSON_NAME_ERROR_INFO.message,
          code: PERSON_NAME_ERROR_INFO.code,
        });

      if (isValidFullNameLength(value)) {
        return createPersonNameError();
      }

      if (isFullNameValidCharacters(value)) {
        return createPersonNameError();
      }

      if (isStartsWithAndEndsWithLetter(value)) {
        return createPersonNameError();
      }

      if (isHasConsecutiveChars(value)) {
        return createPersonNameError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
