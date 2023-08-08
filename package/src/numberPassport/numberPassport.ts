import { CommonRuleParams, createRule } from '../core';

import { NUMBER_PASSPORT_ERROR_INFO } from './constants';

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
 * const validate = string(numberPassport());
 * validate('704564);
 * ```
 */
export const numberPassport = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: PassportNumberParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createPassportError = () =>
        ctx.createError({
          message: params?.message || NUMBER_PASSPORT_ERROR_INFO.message,
          code: NUMBER_PASSPORT_ERROR_INFO.code,
        });

      const minNumber = '000101';
      const maxNumber = '999999';

      if (value < minNumber || value > maxNumber) {
        return createPassportError();
      }

      if (!/^\d{6}$/.test(value)) {
        return createPassportError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
