import { CommonRuleParams, createRule } from '../core';

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
      const createNameError = () =>
        ctx.createError({
          message: params?.message || PATRONYMIC_ERROR_INFO.message,
          code: PATRONYMIC_ERROR_INFO.code,
        });

      // Проверка на длину отчества (минимум 1 символ, максимум 200)
      if (value.length < 1 || value.length > 200) {
        return createNameError();
      }

      // Разрешенные символы: прописные (большие) и строчные буквы (включая ё) русского алфавита,
      // прописные (большие) буквы I и V латинского алфавита, -, пробел, точка, апостроф, запятая, открывающая и закрывающая скобка
      if (!/^[а-яёА-ЯЁIV'-.,() ]+$/.test(value)) {
        return createNameError();
      }

      // Начинается с буквы и заканчивается буквой
      if (!/^[а-яёА-ЯЁIV][а-яёА-ЯЁIV'-.,() ]*[а-яёА-ЯЁIV]$/.test(value)) {
        return createNameError();
      }

      // Не может содержать последовательно два спецсимвола/пробела
      if (/[' .,()-]{2}/.test(value)) {
        return createNameError();
      }

      return;
    },
    { exclude: params?.exclude },
  );
