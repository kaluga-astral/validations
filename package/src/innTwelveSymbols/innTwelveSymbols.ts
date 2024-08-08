import { type CommonRuleParams, createRule } from '../core';

import {
  FIRST_INN_12_SYMBOLS_DECODING,
  INN_12_SYMBOLS_ERROR_INFO,
  INN_12_SYMBOLS_LENGTH,
  SECOND_INN_12_SYMBOLS_DECODING,
} from './constants';

type InnTwelveSymbolsParams = CommonRuleParams<string> & {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

const firstCheckSumForInnTwelveSymbols = (arrSymbols: string[]) =>
  (arrSymbols
    .slice(0, -2)
    .reduce(
      (sum, symbol, index) =>
        FIRST_INN_12_SYMBOLS_DECODING[index] * Number(symbol) + sum,
      0,
    ) %
    11) %
  10;

const secondCheckSumForInnTwelveSymbols = (arrSymbols: string[]) =>
  (arrSymbols
    .slice(0, -1)
    .reduce(
      (sum, symbol, index) =>
        SECOND_INN_12_SYMBOLS_DECODING[index] * Number(symbol) + sum,
      0,
    ) %
    11) %
  10;

/**
 * Проверяет, валиден ли ИНН из 12 символов
 * @example
 * ```ts
 * const validate = string(innTwelveSymbols());
 * validate('7728168971');
 * ```
 */
export const innTwelveSymbols = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: InnTwelveSymbolsParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createInnTwelveSymbolsError = () =>
        ctx.createError({
          message: params?.message || INN_12_SYMBOLS_ERROR_INFO.message,
          code: INN_12_SYMBOLS_ERROR_INFO.code,
        });

      if (value.length !== INN_12_SYMBOLS_LENGTH) {
        return createInnTwelveSymbolsError();
      }

      const arrSymbols = value.split('');

      const firstChecksum = firstCheckSumForInnTwelveSymbols(arrSymbols);

      const secondChecksum = secondCheckSumForInnTwelveSymbols(arrSymbols);

      if (
        Number(value[10]) !== firstChecksum ||
        Number(value[11]) !== secondChecksum
      ) {
        return createInnTwelveSymbolsError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
