import {
  CommonRuleParams,
  createRule,
  fullNameLength,
  hasConsecutiveChars,
  isFullNameValidCharacters,
  isStartsWithAndEndsWithLetter,
} from '../core';

import { NAME_ERROR_INFO } from './constants';

type NameParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валидно ли имя
 * @example
 * ```ts
 * const validate = string(name());
 * validate("Иван");
 * ```
 */
export const name = <TLastSchemaValues extends Record<string, unknown>>(
  params?: NameParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createNameError = () =>
        ctx.createError({
          message: params?.message || NAME_ERROR_INFO.message,
          code: NAME_ERROR_INFO.code,
        });

      if (fullNameLength(value)) {
        return createNameError();
      }

      if (isFullNameValidCharacters(value)) {
        return createNameError();
      }

      if (isStartsWithAndEndsWithLetter(value)) {
        return createNameError();
      }

      if (hasConsecutiveChars(value)) {
        return createNameError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
