import {
  type CommonRuleParams,
  createRule,
  isNoDoubleZeroStart,
} from '../core';
import { onlyNumber } from '../onlyNumber';

import {
  PASSPORT_SERIES_ERROR_INFO,
  PASSPORT_SERIES_ERROR_LENGTH_INFO,
  PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO,
} from './constants';

type PassportSeriesParams = CommonRuleParams<string> & {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет валидна ли серия паспорта
 * @example
 * ```ts
 * const validate = string(passportSeries());
 * validate('9217');
 * ```
 */

export const passportSeries = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: PassportSeriesParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      if (onlyNumber()(value)) {
        return ctx.createError({
          message:
            params?.message || PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO.message,
          code: PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO.code,
        });
      }

      if (value.length !== 4) {
        return ctx.createError({
          message: params?.message || PASSPORT_SERIES_ERROR_LENGTH_INFO.message,
          code: PASSPORT_SERIES_ERROR_LENGTH_INFO.code,
        });
      }

      if (!isNoDoubleZeroStart(value)) {
        return ctx.createError({
          message: params?.message || PASSPORT_SERIES_ERROR_INFO.message,
          code: PASSPORT_SERIES_ERROR_INFO.code,
        });
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
