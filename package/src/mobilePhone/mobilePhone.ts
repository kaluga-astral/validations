import { CommonRuleParams, createRule } from '../core';

import { MOBILE_PHONE_ERROR_INFO, MOBILE_PHONE_REGEX } from './constants';

type MobilePhoneParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

export const mobilePhone = <TValues>(params?: MobilePhoneParams) =>
  createRule<string, TValues>(
    (value, ctx) => {
      const createMobilePhoneError = () =>
        ctx.createError({
          message: params?.message || MOBILE_PHONE_ERROR_INFO.message,
          code: MOBILE_PHONE_ERROR_INFO.code,
        });

      if (!MOBILE_PHONE_REGEX.test(value)) {
        return createMobilePhoneError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
