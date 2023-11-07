import { CommonRuleParams, createRule } from '../core';
import { innTwelveSymbols } from '../innTwelveSymbols';

import { INN_FL_ERROR_INFO } from './constants';

type InnFLParams = CommonRuleParams<string> & {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * @description Проверяет валиден ли ИНН ФЛ
 * @example
 * ```ts
 * const validate = string(innFL());
 * validate('7728168971');
 * ```
 */
export const innFL = <TLastSchemaValues extends Record<string, unknown>>(
  params?: InnFLParams,
) =>
  createRule<string, TLastSchemaValues>(
    (value, ctx) => {
      const createInnFLError = () =>
        ctx.createError({
          message: params?.message || INN_FL_ERROR_INFO.message,
          code: INN_FL_ERROR_INFO.code,
        });

      if (innTwelveSymbols()(value) !== undefined) {
        return createInnFLError();
      }

      return undefined;
    },
    { exclude: params?.exclude },
  );
