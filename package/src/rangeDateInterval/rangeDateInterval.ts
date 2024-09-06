import { addDays, addMonths, addYears } from '@astral/utils';

import { createRule, isDateEarlier } from '../core';

import { RANGE_DATE_INTERVAL_ERROR_INFO } from './constants';
import type { DateUnit, DefaultMessage, RangeDateValue } from './types';

type RangeDateIntervalParams = {
  limit: number;

  /**
   * Еденицы измерения лимита
   * @default 'day'
   */
  unit?: DateUnit;

  /**
   * Замена стандартного сообщения об ошибки
   */
  message?: string;
};

const selectAddingStrategy = (unit: DateUnit) => {
  const strategy = {
    day: addDays,
    month: addMonths,
    year: addYears,
  };

  return strategy[unit];
};

/**
 * Проверяет значение интревала на ограничение
 * @example
 * ```ts
 * const validate = object(rangeDateInterval({ limit: 14 }));
 * validate({ start: new Date('2024.08.15'), end: new Date('2024.09.05') });
 * ```
 */
export const rangeDateInterval = <
  TLastSchemaValues extends Record<string, unknown>,
>(
  params: RangeDateIntervalParams,
) =>
  createRule<RangeDateValue, TLastSchemaValues>((value, ctx) => {
    const { limit, unit = 'day', message } = params;

    if (!value.start || !value.end) {
      return undefined;
    }

    const addLimits = selectAddingStrategy(unit);

    if (!isDateEarlier(value.end, addLimits(value.start, limit))) {
      return ctx.createError({
        message:
          message ||
          (RANGE_DATE_INTERVAL_ERROR_INFO.message as DefaultMessage)(
            limit,
            unit,
          ),
        code: RANGE_DATE_INTERVAL_ERROR_INFO.code,
      });
    }

    return undefined;
  });
