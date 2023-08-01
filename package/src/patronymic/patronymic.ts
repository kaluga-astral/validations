import {
  CommonRuleParams,
  createRule,
  isCheckForSpecialCharacters,
  isCheckValidCharacters,
  isCheckValidLength,
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
export const patronymic = <TValues>(params?: PatronymicParams) =>
  createRule<string, TValues>(
    (value, ctx) => {
      const createPatronymicError = () =>
        ctx.createError({
          message: params?.message || PATRONYMIC_ERROR_INFO.message,
          code: PATRONYMIC_ERROR_INFO.code,
        });

      // Проверка на длину отчества (минимум 1 символ, максимум 200)
      if (isCheckValidLength(value)) {
        return createPatronymicError();
      }

      // Разрешенные символы: прописные (большие) и строчные буквы (включая ё) русского алфавита,
      // прописные (большие) буквы I и V латинского алфавита, -, пробел, точка, апостроф, запятая, открывающая и закрывающая скобка
      if (isCheckValidCharacters(value)) {
        return createPatronymicError();
      }

      // Начинается с буквы и заканчивается буквой
      if (isStartsWithAndEndsWithLetter(value)) {
        return createPatronymicError();
      }

      // Не может содержать последовательно два спецсимвола/пробела
      if (isCheckForSpecialCharacters(value)) {
        return createPatronymicError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
