import { CommonRuleParams, createRule } from '../core';

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
      if (value.length < 1 || value.length > 200) {
        return createSurnameError();
      }

      // Проверка на допустимые символы в фамилии
      if (!/^[а-яёА-ЯЁIV'][- а-яёА-ЯЁIV.']*$/.test(value)) {
        return createSurnameError();
      }

      // Проверка, что фамилия начинается с буквы или апострофа, и заканчивается буквой
      if (!/^[а-яёА-ЯЁIV'][а-яёА-ЯЁIV'-.,() ]*[а-яёА-ЯЁIV]$/.test(value)) {
        return createSurnameError();
      }

      // Проверка на наличие последовательно двух специальных символов или пробелов
      if (/[' .,()-]{2}/.test(value)) {
        return createSurnameError();
      }

      return;
    },
    { exclude: params?.exclude },
  );
