import { onlyNumber } from '../onlyNumber';
import { CommonRuleParams, createRule } from '../core';

import {
  PASSPORT_NUMBER_ERROR_INFO,
  PASSPORT_NUMBER_LENGTH_ERROR_INFO,
  PASSPORT_NUMBER_ONLY_DIGITS_ERROR_INFO,
} from './constants';

type PassportNumberParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валиден ли номер паспорта
 * @example
 * ```ts
 * const validate = string(passportNumber());
 * validate('704564');
 * ```
 */
export const passportNumber = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: PassportNumberParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      if (onlyNumber()(value)) {
        return ctx.createError({
          message:
            params?.message || PASSPORT_NUMBER_ONLY_DIGITS_ERROR_INFO.message,
          code: PASSPORT_NUMBER_ONLY_DIGITS_ERROR_INFO.code,
        });
      }

      if (value.length !== 6) {
        return ctx.createError({
          message: params?.message || PASSPORT_NUMBER_LENGTH_ERROR_INFO.message,
          code: PASSPORT_NUMBER_LENGTH_ERROR_INFO.code,
        });
      }

      if (value < '000101' || value > '999999') {
        return ctx.createError({
          message: params?.message || PASSPORT_NUMBER_ERROR_INFO.message,
          code: PASSPORT_NUMBER_ERROR_INFO.code,
        });
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
