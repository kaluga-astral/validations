import { createRule } from '../core';

import { GUID_REGEXP, INVALID_GUID_ERROR_INFO } from './constants';

type GuidParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валидность GUID.
 * @example
 * ```ts
 *  const validate = string(guid());
 *  validate('C56A4180-65AA-42EC-A945-5FD21DEC0538');
 * ```
 */
export const guid = <TLastSchemaValues extends Record<string, unknown>>(
  params?: GuidParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    if (!GUID_REGEXP.test(value)) {
      return ctx.createError({
        ...INVALID_GUID_ERROR_INFO,
        message: params?.message || INVALID_GUID_ERROR_INFO.message,
      });
    }

    return undefined;
  });
