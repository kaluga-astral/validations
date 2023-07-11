import { CommonRuleParams, createRule } from '../core';

import { SURNAME_ERROR_INFO } from './constants';

type SurnameParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валидна ли фамилия
 * @example
 * ```ts
 * const validate = string(surname());
 * validate("Д'Анжело");
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

      // Проверка на длину фамилии (минимум 1 символ, максимум 200)
      if (value.length < 1 || value.length > 200) {
        return createSurnameError();
      }

      // Начинается с заглавной или апострофа, содержит символы из заданного алфавита, оканчивается только буквой
      if (!/^[А-ЯЁIV'][а-яёА-ЯЁIV' .,()-]*[а-яё]$/.test(value)) {
        return createSurnameError();
      }

      // Специальные символы не должны повторяться
      if (!/^(?!.*[' .,()-]{2}).+$/.test(value)) {
        return createSurnameError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
