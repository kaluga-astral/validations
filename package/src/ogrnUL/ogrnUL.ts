import { type CommonRuleParams, createRule, isStringOfZeros } from '../core';

import { OGRN_UL_ERROR_INFO, OGRN_UL_LENGTH } from './constants';

type OgrnULParams = CommonRuleParams<string> & {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет валиден ли ОГРН ЮЛ
 * @example
 * ```ts
 * const validate = string(ogrnIP());
 * validate('7728168971');
 * ```
 */
export const ogrnUL = <TLastSchemaValues extends Record<string, unknown>>(
  params?: OgrnULParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createOgrnUlError = () =>
        ctx.createError({
          message: params?.message || OGRN_UL_ERROR_INFO.message,
          code: OGRN_UL_ERROR_INFO.code,
        });

      if (isStringOfZeros(value)) {
        return createOgrnUlError();
      }

      if (value.length !== OGRN_UL_LENGTH) {
        return createOgrnUlError();
      }

      const checkSum = (parseInt(value.slice(0, -1)) % 11).toString().slice(-1);

      if (value.slice(12, 13) !== checkSum) {
        return createOgrnUlError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
