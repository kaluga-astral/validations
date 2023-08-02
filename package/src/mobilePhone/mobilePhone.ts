import { CommonRuleParams, createRule } from '../core';

import { MOBILE_PHONE_ERROR_INFO, MOBILE_PHONE_REGEX } from './constants';

type MobilePhoneParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description
 * Проверяет валиден ли мобильный телефон.
 * Валидный телефон начинается с "79" и не содержит символов, кроме цифр.
 * @example
 * ```ts
 * const validate = string(mobilePhone());
 * validate('79999999999');
 * ```
 */
export const mobilePhone = <TLastSchemaValues extends Record<string, unknown>>(
  params?: MobilePhoneParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      if (!MOBILE_PHONE_REGEX.test(value)) {
        return ctx.createError({
          message: params?.message || MOBILE_PHONE_ERROR_INFO.message,
          code: MOBILE_PHONE_ERROR_INFO.code,
        });
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
