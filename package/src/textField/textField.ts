import { createRule } from '../core';

import {
  INVALID_TEXT_FIELD_ERROR_INFO,
  LENGTH_TEXT_FIELD_ERROR_INFO,
  TEXT_FIELD_MAX_LENGTH,
  TEXT_FIELD_REGEXP,
} from './constants';

type TextFieldParams = {
  /**
   * Замена стандартного сообщения ошибки.
   */
  customLength?: number;
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
  /**
   * Замена стандартного сообщения ошибки при превышении допустимого количества символов.
   */
  invalidLengthMessage?: string;
};

/**
 * Проверяет валидность текстового поля
 * @example
 * ```ts
 *  const validate = string(textField());
 *  validate('Авада кедавра...');
 * ```
 */
export const textField = <TLastSchemaValues extends Record<string, unknown>>(
  params?: TextFieldParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    if (value.length > (params?.customLength || TEXT_FIELD_MAX_LENGTH)) {
      return ctx.createError({
        ...LENGTH_TEXT_FIELD_ERROR_INFO,
        message:
          params?.invalidLengthMessage || LENGTH_TEXT_FIELD_ERROR_INFO.message,
      });
    }

    if (!TEXT_FIELD_REGEXP.test(value)) {
      return ctx.createError({
        ...INVALID_TEXT_FIELD_ERROR_INFO,
        message: params?.message || INVALID_TEXT_FIELD_ERROR_INFO.message,
      });
    }

    return undefined;
  });
