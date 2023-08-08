import { CommonRuleParams, createRule } from '../core';

import { CODE_PASSPORT_ERROR_INFO } from './constants';

type PassportCodeParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валиден ли код паспорта
 * @example
 * ```ts
 * const validate = string(codePassport());
 * validate('123-456');
 * ```
 */
export const codePassport = <TLastSchemaValues extends Record<string, unknown>>(
  params?: PassportCodeParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createPassportError = () =>
        ctx.createError({
          message: params?.message || CODE_PASSPORT_ERROR_INFO.message,
          code: CODE_PASSPORT_ERROR_INFO.code,
        });

      if (!/^(?!00)[0-3]{3}[-]{1}[0-9]{3}$/.test(value)) {
        return createPassportError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
