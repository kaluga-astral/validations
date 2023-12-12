import {
  type CommonRuleParams,
  createRule,
  isNoDoubleZeroStart,
} from '../core';
import { onlyNumber } from '../onlyNumber';

import {
  PASSPORT_CODE_ERROR_INFO,
  PASSPORT_CODE_LENGTH_ERROR_INFO,
  PASSPORT_CODE_ONLY_DIGITS_ERROR_INFO,
} from './constants';

type PassportCodeParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валиден ли код паспорта
 * @example
 * ```ts
 * const validate = string(passportCode());
 * validate('123456');
 * ```
 */
export const passportCode = <TLastSchemaValues extends Record<string, unknown>>(
  params?: PassportCodeParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      if (onlyNumber()(value)) {
        return ctx.createError({
          message:
            params?.message || PASSPORT_CODE_ONLY_DIGITS_ERROR_INFO.message,
          code: PASSPORT_CODE_ONLY_DIGITS_ERROR_INFO.code,
        });
      }

      if (!isNoDoubleZeroStart(value)) {
        return ctx.createError({
          message: params?.message || PASSPORT_CODE_ERROR_INFO.message,
          code: PASSPORT_CODE_ERROR_INFO.code,
        });
      }

      if (value.length !== 6) {
        return ctx.createError({
          message: params?.message || PASSPORT_CODE_LENGTH_ERROR_INFO.message,
          code: PASSPORT_CODE_LENGTH_ERROR_INFO.code,
        });
      }

      if (!/^([0-9]{2}[0-3])/.test(value)) {
        return ctx.createError({
          message: params?.message || PASSPORT_CODE_ERROR_INFO.message,
          code: PASSPORT_CODE_ERROR_INFO.code,
        });
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
