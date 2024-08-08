import { type ValidationContext, createRule, resetTime } from '../core';

import {
  ARRAY_MIN_ERROR_CODE,
  DATE_MIN_ERROR_CODE,
  NUMBER_MIN_ERROR_CODE,
  STRING_MIN_ERROR_CODE,
} from './constants';

type BaseMinValidationTypes = number | string | Array<unknown>;
type CommonMinValidationTypes = BaseMinValidationTypes | Date;
type CommonThreshold = number | Date;

type MinParams<ValidationType> = {
  /**
   * Сообщение ошибки
   */
  getMessage?: (
    threshold: CommonThreshold,
    value: ValidationType,
    ctx: ValidationContext,
  ) => string;
};

/**
 * Проверяет значение на соответствие минимуму. Работает с: string, array, Date, number
 * @param threshold - нижний доступный порог value
 * @example
 * ```ts
 *  string(min(22));
 *
 *  number(min(22));
 *
 *  array(min(2)));
 *
 *  date(min(new Date())));
 * ```
 */
export function min<
  ValidationType extends Date,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  threshold: Date,
  params?: MinParams<ValidationType>,
): ReturnType<typeof createRule<Date, TLastSchemaValues>>;

export function min<
  ValidationType extends BaseMinValidationTypes,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  threshold: number,
  params?: MinParams<ValidationType>,
): ReturnType<typeof createRule<BaseMinValidationTypes, TLastSchemaValues>>;

export function min<
  ValidationType extends CommonMinValidationTypes,
  TLastSchemaValues extends Record<string, unknown> = {},
>(threshold: CommonThreshold, params?: MinParams<ValidationType>) {
  return createRule<ValidationType, TLastSchemaValues>((value, ctx) => {
    const getMessage = (typeMessage: string) =>
      params?.getMessage
        ? params.getMessage(threshold, value, ctx)
        : typeMessage;

    if (value instanceof Date && threshold instanceof Date) {
      return resetTime(value) >= resetTime(threshold)
        ? undefined
        : ctx.createError({
            code: DATE_MIN_ERROR_CODE,
            message: getMessage(
              `Не раньше ${threshold.toLocaleDateString('ru')}`,
            ),
          });
    }

    if (threshold instanceof Date) {
      return undefined;
    }

    if (typeof value === 'string') {
      const isError = value.trim().length < threshold;

      return isError
        ? ctx.createError({
            code: STRING_MIN_ERROR_CODE,
            message: getMessage(`Мин. символов: ${threshold}`),
          })
        : undefined;
    }

    if (Array.isArray(value) && value.length < threshold) {
      return ctx.createError({
        code: ARRAY_MIN_ERROR_CODE,
        message: getMessage(`Не меньше ${threshold}`),
      });
    }

    if (typeof value === 'number' && value < threshold) {
      return ctx.createError({
        code: NUMBER_MIN_ERROR_CODE,
        message: getMessage(`Не меньше ${threshold}`),
      });
    }

    return undefined;
  });
}
