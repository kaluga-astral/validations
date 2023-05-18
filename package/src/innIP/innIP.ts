import { CommonRuleParams, createRule, isStringOfZeros } from '../core';

import {
  FIRST_INN_IP_DECODING,
  INN_IP_ERROR_INFO,
  INN_IP_LENGTH,
  SECOND_INN_IP_DECODING,
} from './constants';

type InnIPParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
  /**
   * @description Позволяет указать значение  в качестве исключения из правил.
   */
  exclude?: CommonRuleParams<string>['exclude'];
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
 * @example innIP()('7728168971');
 */
export const innIP = <TValues>({ message, exclude }: InnIPParams = {}) =>
  createRule<string, TValues>(
    (value, ctx) => {
      const createInnIPError = () =>
        ctx.createError({
          message: message || INN_IP_ERROR_INFO.message,
          code: INN_IP_ERROR_INFO.code,
        });

      if (isStringOfZeros(value)) {
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
    { exclude },
  );
