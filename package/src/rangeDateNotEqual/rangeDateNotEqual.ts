import { isDate } from '@astral/utils';

import { createRule, resetTime } from '../core';

import { RANGE_DATE_NOT_EQUAL_ERROR_INFO } from './constants';

type RangeDateValue = { start?: Date; end?: Date };

type RangeDateNotEqualParams = {
  /**
   * Замена стандартного сообщения ошибки
   */
  message?: string;
};

const isDateEqual = (dateA: Date, dateB: Date) => {
  return resetTime(dateA).getTime() === resetTime(dateB).getTime();
};

/**
 * Проверяет даты интервала на совпадение даты начала и окончания
 * @example
 * ```ts
 * const validate = object(rangeDateNotEqual());
 * validate({ start: new Date(), end: new Date() });
 * ```
 */
export const rangeDateNotEqual = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: RangeDateNotEqualParams,
) =>
  createRule<RangeDateValue, TLastSchemaValues>((value, ctx) => {
    if (!value.start || !value.end) {
      return undefined;
    }

    if (!isDate(value.start) || !isDate(value.end)) {
      return undefined;
    }

    if (isDateEqual(value.start, value.end)) {
      return ctx.createError({
        message: params?.message || RANGE_DATE_NOT_EQUAL_ERROR_INFO.message,
        code: RANGE_DATE_NOT_EQUAL_ERROR_INFO.code,
      });
    }

    return undefined;
  });
