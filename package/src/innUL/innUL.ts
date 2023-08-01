import {
  CommonRuleParams,
  createRule,
  isNoDoubleZeroStart,
  isStringOfZeros,
} from '../core';

import { INN_UL_DECODING, INN_UL_ERROR_INFO, INN_UL_LENGTH } from './constants';

type InnULParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

const calcCheckSumForInnUl = (arrSymbols: string[]) =>
  (arrSymbols
    .slice(0, -1)
    .reduce(
      (sum, symbol, index) => INN_UL_DECODING[index] * Number(symbol) + sum,
      0,
    ) %
    11) %
  10;

/**
 * @description Проверяет валиден ли ИНН ЮЛ
 * @example
 * ```ts
 * const validate = string(innUL());
 * validate('7728168971');
 * ```
 */
export const innUL = <TLastSchemaValues extends Record<string, unknown>>(
  params?: InnULParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createInnUlError = () =>
        ctx.createError({
          message: params?.message || INN_UL_ERROR_INFO.message,
          code: INN_UL_ERROR_INFO.code,
        });

      if (isStringOfZeros(value)) {
        return createInnUlError();
      }

      if (!isNoDoubleZeroStart(value)) {
        return createInnUlError();
      }

      if (value.length !== INN_UL_LENGTH) {
        return createInnUlError();
      }

      const arrSymbols = value.split('');

      if (arrSymbols.some((symbol) => isNaN(Number(symbol)))) {
        return createInnUlError();
      }

      const checksum = calcCheckSumForInnUl(arrSymbols);

      if (Number(value[9]) !== checksum) {
        return createInnUlError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
