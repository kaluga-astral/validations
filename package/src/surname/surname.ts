import {
  CommonRuleParams,
  createRule,
  isCheckForSpecialCharacters,
  isCheckValidCharacters,
  isCheckValidLength,
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
export const surname = <TValues>(params?: SurnameParams) =>
  createRule<string, TValues>(
    (value, ctx) => {
      const createSurnameError = () =>
        ctx.createError({
          message: params?.message || SURNAME_ERROR_INFO.message,
          code: SURNAME_ERROR_INFO.code,
        });

      // Проверка на длину имени (минимум 1 символ, максимум 200)
      if (isCheckValidLength(value)) {
        return createSurnameError();
      }

      // Разрешенные символы: прописные (большие) и строчные буквы (включая ё) русского алфавита,
      // прописные (большие) буквы I и V латинского алфавита, -, пробел, точка, апостроф, запятая, открывающая и закрывающая скобка
      if (isCheckValidCharacters(value)) {
        return createSurnameError();
      }

      // Начинается с буквы и заканчивается буквой
      if (isStartsWithAndEndsWithLetter(value)) {
        return createSurnameError();
      }

      // Проверка на наличие последовательно двух специальных символов или пробелов
      if (isCheckForSpecialCharacters(value)) {
        return createSurnameError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
