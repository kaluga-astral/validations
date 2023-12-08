import { type CommonRuleParams, createRule, isStringOfZeros } from '../core';

import { OGRN_IP_ERROR_INFO, OGRN_IP_LENGTH } from './constants';

type OgrnIPParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валиден ли ОГРН ИП
 * @example
 * ```ts
 * const validate = string(ogrnIP());
 * validate('7728168971');
 * ```
 */
export const ogrnIP = <TLastSchemaValues extends Record<string, unknown>>(
  params?: OgrnIPParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createOgrnIPError = () =>
        ctx.createError({
          message: params?.message || OGRN_IP_ERROR_INFO.message,
          code: OGRN_IP_ERROR_INFO.code,
        });

      if (isStringOfZeros(value)) {
        return createOgrnIPError();
      }

      if (value.length !== OGRN_IP_LENGTH) {
        return createOgrnIPError();
      }

      const checkSum = (parseInt(value.slice(0, -1)) % 13).toString().slice(-1);

      if (value.slice(14, 15) !== checkSum) {
        return createOgrnIPError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
