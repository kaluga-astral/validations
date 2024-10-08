import { isDate } from '@astral/utils';

import { createRule, isDateEarlier } from '../core';
import {
  RANGE_DATE_END_INVALID_ERROR_INFO,
  RANGE_DATE_START_INVALID_ERROR_INFO,
} from '../rangeDate';

import {
  RANGE_DATE_MAX_ERROR_INFO,
  RANGE_DATE_MIN_ERROR_INFO,
} from './constants';

type RangeDateValue = { start?: Date; end?: Date };

type LimitOptions = {
  /**
   * Дата
   */
  limit: Date;

  /**
   * Замена стандартного сообщения ошибки
   */
  message?: (field: 'start' | 'end', date: string) => string;
};

type RangeDateMinMaxParams = {
  start?: { min?: LimitOptions; max?: LimitOptions };
  end?: { min?: LimitOptions; max?: LimitOptions };
};

const formatDateToView = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU').format(date);
};

/**
 * Проверяет даты на минимальное и максимальное допустимое значение
 * @example
 * ```ts
 * const validate = rangeDate(rangeDateMinMax({ start: { min: { limit: new Date(2023, 0, 1) }}, end: { max: { limit: new Date() } } }));
 * validate({ start: new Date(), end: new Date() });
 * ```
 */
export const rangeDateMinMax = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params?: RangeDateMinMaxParams,
) =>
  createRule<RangeDateValue, TLastSchemaValues>((value, ctx) => {
    if (!value.start && !value.end) {
      return undefined;
    }

    if (value?.start && !isDate(value.start)) {
      return ctx.createError({
        message: RANGE_DATE_START_INVALID_ERROR_INFO.message,
        code: RANGE_DATE_START_INVALID_ERROR_INFO.code,
      });
    }

    if (value?.end && !isDate(value.end)) {
      return ctx.createError({
        message: RANGE_DATE_END_INVALID_ERROR_INFO.message,
        code: RANGE_DATE_END_INVALID_ERROR_INFO.code,
      });
    }

    // Если дата начала раньше заданной минимальной
    if (
      params?.start?.min?.limit &&
      value.start &&
      isDateEarlier(value.start, params?.start.min?.limit)
    ) {
      return ctx.createError({
        message:
          params.start.min.message?.(
            'start',
            formatDateToView(params.start.min.limit),
          ) ||
          RANGE_DATE_MIN_ERROR_INFO.message(
            'start',
            formatDateToView(params.start.min.limit),
          ),
        code: RANGE_DATE_MIN_ERROR_INFO.code,
      });
    }

    // Если дата начала позже заданной максимальной
    if (
      params?.start?.max?.limit &&
      value.start &&
      isDateEarlier(params?.start.max?.limit, value.start)
    ) {
      return ctx.createError({
        message:
          params.start.max.message?.(
            'start',
            formatDateToView(params.start.max.limit),
          ) ||
          RANGE_DATE_MAX_ERROR_INFO.message(
            'start',
            formatDateToView(params.start.max.limit),
          ),
        code: RANGE_DATE_MAX_ERROR_INFO.code,
      });
    }

    // Если дата окончания раньше заданной минимальной
    if (
      params?.end?.min?.limit &&
      value.end &&
      isDateEarlier(value.end, params?.end.min?.limit)
    ) {
      return ctx.createError({
        message:
          params.end.min.message?.(
            'start',
            formatDateToView(params.end.min.limit),
          ) ||
          RANGE_DATE_MIN_ERROR_INFO.message(
            'end',
            formatDateToView(params.end.min.limit),
          ),
        code: RANGE_DATE_MIN_ERROR_INFO.code,
      });
    }

    // Если дата окончания позже заданной максимально
    if (
      params?.end?.max?.limit &&
      value.end &&
      isDateEarlier(params?.end.max?.limit, value.end)
    ) {
      return ctx.createError({
        message:
          params.end.max.message?.(
            'start',
            formatDateToView(params.end.max.limit),
          ) ||
          RANGE_DATE_MAX_ERROR_INFO.message(
            'end',
            formatDateToView(params.end.max.limit),
          ),
        code: RANGE_DATE_MAX_ERROR_INFO.code,
      });
    }

    return undefined;
  });
