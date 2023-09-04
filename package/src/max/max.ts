import { ValidationContext, createRule, resetTime } from '../core';

import {
  ARRAY_MAX_ERROR_CODE,
  DATE_MAX_ERROR_CODE,
  NUMBER_MAX_ERROR_CODE,
  STRING_MAX_ERROR_CODE,
} from './constants';

type BaseMaxValidationTypes = number | string | Array<unknown>;
type CommonMaxValidationTypes = BaseMaxValidationTypes | Date;
type CommonThreshold = number | Date;

type MaxParams<ValidationType> = {
  /**
   * @description Сообщение ошибки
   */
  getMessage?: (
    threshold: CommonThreshold,
    value: ValidationType,
    ctx: ValidationContext,
  ) => string;
};

/**
 * @description Проверяет значение на соответствие максимуму. Работает с: string, array, Date, number
 * @param threshold - верхний доступный порог value
 * @example
 * ```ts
 *  string(max(22));
 *
 *  number(max(22));
 *
 *  array(max(2)));
 *
 *  date(max(new Date())));
 * ```
 */
export function max<
  ValidationType extends Date,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  threshold: Date,
  params?: MaxParams<ValidationType>,
): ReturnType<typeof createRule<Date, TLastSchemaValues>>;

export function max<
  ValidationType extends BaseMaxValidationTypes,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  threshold: number,
  params?: MaxParams<ValidationType>,
): ReturnType<typeof createRule<BaseMaxValidationTypes, TLastSchemaValues>>;

export function max<
  ValidationType extends CommonMaxValidationTypes,
  TLastSchemaValues extends Record<string, unknown> = {},
>(threshold: CommonThreshold, params?: MaxParams<ValidationType>) {
  return createRule<ValidationType, TLastSchemaValues>((value, ctx) => {
    const getMessage = (typeMessage: string) =>
      params?.getMessage
        ? params.getMessage(threshold, value, ctx)
        : typeMessage;

    if (value instanceof Date && threshold instanceof Date) {
      return resetTime(value) <= resetTime(threshold)
        ? undefined
        : ctx.createError({
            code: DATE_MAX_ERROR_CODE,
            message: getMessage(
              `Не позднее ${threshold.toLocaleDateString('ru')}`,
            ),
          });
    }

    if (threshold instanceof Date) {
      return undefined;
    }

    if (typeof value === 'string') {
      const isError = value.trim().length > threshold;

      return isError
        ? ctx.createError({
            code: STRING_MAX_ERROR_CODE,
            message: getMessage(`Макс. символов: ${threshold}`),
          })
        : undefined;
    }

    if (Array.isArray(value) && value.length > threshold) {
      return ctx.createError({
        code: ARRAY_MAX_ERROR_CODE,
        message: getMessage(`Не больше ${threshold}`),
      });
    }

    if (typeof value === 'number' && value > threshold) {
      return ctx.createError({
        code: NUMBER_MAX_ERROR_CODE,
        message: getMessage(`Не больше ${threshold}`),
      });
    }

    return undefined;
  });
}
