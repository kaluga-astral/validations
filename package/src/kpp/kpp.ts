import {
  CommonRuleParams,
  ErrorInfo,
  createRule,
  isNoDoubleZeroStart,
  isStringOfZeros,
} from '../core';

import {
  KPP_DOUBLE_ZERO_START_ERROR_INFO,
  KPP_PATTERN_ERROR_INFO,
  KPP_REGEX,
  KPP_ZEROS_ONLY_ERROR_INFO,
} from './constants';

type KPPParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валидность кода КПП
 * @example
 * ```ts
 * const validate = string(kpp());
 * validate('770201001');
 * ```
 */
export const kpp = <TLastSchemaValues extends Record<string, unknown>>(
  params?: KPPParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createKppError = (errorInfoObj: ErrorInfo) =>
        ctx.createError({
          message: params?.message || errorInfoObj.message,
          code: errorInfoObj.code,
        });

      if (!KPP_REGEX.test(value)) {
        return createKppError(KPP_PATTERN_ERROR_INFO);
      }

      if (isStringOfZeros(value)) {
        return createKppError(KPP_ZEROS_ONLY_ERROR_INFO);
      }

      if (!isNoDoubleZeroStart(value)) {
        return createKppError(KPP_DOUBLE_ZERO_START_ERROR_INFO);
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
