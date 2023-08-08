import { CommonRuleParams, createRule } from '../core';

import { SERIES_PASSPORT_ERROR_INFO } from './constants';

type PassportSeriesParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валидна ли серия паспорта
 * @example
 * ```ts
 * const validate = string(seriesPassport());
 * validate('92 17');
 * ```
 */

export const seriesPassport = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: PassportSeriesParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createPassportError = () =>
        ctx.createError({
          message: params?.message || SERIES_PASSPORT_ERROR_INFO.message,
          code: SERIES_PASSPORT_ERROR_INFO.code,
        });

      if (!/^(?!00)\d{2} \d{2}$/.test(value)) {
        return createPassportError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
