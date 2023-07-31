import { CommonRuleParams, createRule } from '../core';

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
export const name = <TValues>(params?: NameParams) =>
  createRule<string, TValues>(
    (value, ctx) => {
      const createNameError = () =>
        ctx.createError({
          message: params?.message || NAME_ERROR_INFO.message,
          code: NAME_ERROR_INFO.code,
        });

      // Проверка на длину имени (минимум 1 символ, максимум 200)
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

      // значение по умолчанию
      return;
    },
    { exclude: params?.exclude },
  );
