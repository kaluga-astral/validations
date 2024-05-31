import { createRule } from '../core';

import {
  DOUBLE_DOTS_EMAIL_ERROR_INFO,
  EMAIL_MAX_LENGTH,
  EMAIL_REGEXP,
  INVALID_EMAIL_ERROR_INFO,
  LENGTH_EMAIL_ERROR_INFO,
} from './constants';

type EmailParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
  /**
   * @description Замена стандартного сообщения ошибки при превышении допустимого количества символов.
   */
  invalidLengthMessage?: string;
  /**
   * @description Замена стандартного сообщения ошибки для повторяющихся точек.
   */
  doubleDotsErrorMessage?: string;
};

/**
 * @description Проверяет валидность email. Не работает с русскими доменами
 * @example
 * ```ts
 *  const validate = string(email());
 *  validate('example@mail.ru');
 * ```
 */
export const email = <TLastSchemaValues extends Record<string, unknown>>(
  params?: EmailParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    if (!EMAIL_REGEXP.test(value)) {
      return ctx.createError({
        ...INVALID_EMAIL_ERROR_INFO,
        message: params?.message || INVALID_EMAIL_ERROR_INFO.message,
      });
    }

    if (value.length > EMAIL_MAX_LENGTH) {
      return ctx.createError({
        ...LENGTH_EMAIL_ERROR_INFO,
        message:
          params?.invalidLengthMessage || LENGTH_EMAIL_ERROR_INFO.message,
      });
    }

    const [username, hostname] = value.split('@');

    if (username.startsWith('.') || username.startsWith('-')) {
      return ctx.createError({
        ...INVALID_EMAIL_ERROR_INFO,
        message: params?.message || INVALID_EMAIL_ERROR_INFO.message,
      });
    }

    if (username.endsWith('.')) {
      return ctx.createError({
        ...INVALID_EMAIL_ERROR_INFO,
        message: params?.message || INVALID_EMAIL_ERROR_INFO.message,
      });
    }

    if (username.includes('..')) {
      return ctx.createError({
        ...INVALID_EMAIL_ERROR_INFO,
        message:
          params?.doubleDotsErrorMessage ||
          DOUBLE_DOTS_EMAIL_ERROR_INFO.message,
      });
    }

    return undefined;
  });
