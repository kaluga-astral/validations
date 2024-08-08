import {
  type CommonRuleParams,
  createRule,
  isNoDoubleZeroStart,
  isStringOfZeros,
} from '../core';
import { innTwelveSymbols } from '../innTwelveSymbols';

import { INN_IP_ERROR_INFO } from './constants';

type InnIPParams = CommonRuleParams<string> & {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет валиден ли ИНН ИП
 * @example
 * ```ts
 * const validate = string(innIP());
 * validate('384212952720');
 * ```
 */
export const innIP = <TLastSchemaValues extends Record<string, unknown>>(
  params?: InnIPParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createInnIPError = () =>
        ctx.createError({
          message: params?.message || INN_IP_ERROR_INFO.message,
          code: INN_IP_ERROR_INFO.code,
        });

      if (isStringOfZeros(value)) {
        return createInnIPError();
      }

      if (!isNoDoubleZeroStart(value)) {
        return createInnIPError();
      }

      if (innTwelveSymbols()(value) !== undefined) {
        return createInnIPError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
