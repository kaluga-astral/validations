import { CommonRuleParams, createRule } from '../core';

import {
  ALPHANUM_SURNAME_ERROR_INFO,
  DOUBLE_SYMBOL_ERROR_INFO,
  LENGTH_ERROR_INFO,
  LETTER_BEGINNING_ERROR_INFO,
  LETTER_ENDING_ERROR_INFO,
} from './constants';

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
      const rAlphabet = /^[а-яёА-ЯЁIV' .,()-]*$/;
      const rFirstChar = /^[А-ЯЁIV'].*/;
      const rLastChar = /.*[а-яё]$/;
      const rDoubleSpec = /^(?!.*[' .,()-]{2}).+$/;

      // Проверка на длину фамилии (минимум 1 символ, максимум 200)
      if (value.length < 1 || value.length > 200) {
        return ctx.createError({
          ...LENGTH_ERROR_INFO,
          message: params?.message || LENGTH_ERROR_INFO.message,
        });
      }

      // Фамилия дожна содержать символы из заданного алфавита
      if (!rAlphabet.test(value)) {
        return ctx.createError({
          ...ALPHANUM_SURNAME_ERROR_INFO,
          message: params?.message || ALPHANUM_SURNAME_ERROR_INFO.message,
        });
      }

      // Фамилия может начинаться только с заглавной буквы или апострофа
      if (!rFirstChar.test(value)) {
        return ctx.createError({
          ...LETTER_BEGINNING_ERROR_INFO,
          message: params?.message || LETTER_BEGINNING_ERROR_INFO.message,
        });
      }

      // Фамилия может заканчиваться только строчной буквой
      if (!rLastChar.test(value)) {
        return ctx.createError({
          ...LETTER_ENDING_ERROR_INFO,
          message: params?.message || LETTER_ENDING_ERROR_INFO.message,
        });
      }

      // Специальные символы не должны повторяться
      if (!rDoubleSpec.test(value)) {
        return ctx.createError({
          ...DOUBLE_SYMBOL_ERROR_INFO,
          message: params?.message || DOUBLE_SYMBOL_ERROR_INFO.message,
        });
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
