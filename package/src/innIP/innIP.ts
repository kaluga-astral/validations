import {
  CommonRuleParams,
  createRule,
  isNoDoubleZeroStart,
  isStringOfZeros,
} from '../core';

import {
  FIRST_INN_IP_DECODING,
  INN_IP_ERROR_INFO,
  INN_IP_LENGTH,
  SECOND_INN_IP_DECODING,
} from './constants';

type InnIPParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

const calcFirstCheckSumForInnIP = (arrSymbols: string[]) =>
  (arrSymbols
    .slice(0, -2)
    .reduce(
      (sum, symbol, index) =>
        FIRST_INN_IP_DECODING[index] * Number(symbol) + sum,
      0,
    ) %
    11) %
  10;

const calcSecondCheckSumForInnIP = (arrSymbols: string[]) =>
  (arrSymbols
    .slice(0, -1)
    .reduce(
      (sum, symbol, index) =>
        SECOND_INN_IP_DECODING[index] * Number(symbol) + sum,
      0,
    ) %
    11) %
  10;

/**
 * @description Проверяет валиден ли ИНН ИП
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

      if (value.length !== INN_IP_LENGTH) {
        return createInnIPError();
      }

      const arrSymbols = value.split('');

      const firstChecksum = calcFirstCheckSumForInnIP(arrSymbols);

      const secondChecksum = calcSecondCheckSumForInnIP(arrSymbols);

      if (
        Number(value[10]) !== firstChecksum &&
        Number(value[11]) !== secondChecksum
      ) {
        return createInnIPError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
