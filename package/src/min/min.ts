import { ValidationContext, createRule } from '../core';

import {
  ARRAY_MIN_ERROR_CODE,
  NUMBER_MIN_ERROR_CODE,
  STRING_MIN_ERROR_CODE,
} from './constants';

type MinValidationTypes = number | string | Array<unknown>;
type Threshold = number;

type MinParams<ValidationType> = {
  /**
   * @description Сообщение ошибки
   */
  getMessage?: (
    threshold: Threshold,
    value: ValidationType,
    ctx: ValidationContext<unknown>,
  ) => string;
};

/**
 * @description Проверяет значение на соответствие минимуму. Работает с: string, array, Date, number
 * @param threshold - нижний доступный порог value
 * @example
 * ```ts
 *  string(min(22));
 *
 *  number(min(22));
 *
 *  array(min(new Date()));
 * ```
 */
export const min = <ValidationType extends MinValidationTypes>(
  threshold: Threshold,
  params?: MinParams<ValidationType>,
) =>
  createRule<ValidationType, unknown>((value, ctx) => {
    const getMessage = (typeMessage: string) =>
      params?.getMessage
        ? params.getMessage(threshold, value, ctx)
        : typeMessage;

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
        message: getMessage(`Не меньше: ${threshold}`),
      });
    }

    if (typeof value === 'number' && value < threshold) {
      return ctx.createError({
        code: NUMBER_MIN_ERROR_CODE,
        message: getMessage(`Не меньше: ${threshold}`),
      });
    }

    return undefined;
  });
