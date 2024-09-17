import { isDate } from '@astral/utils';

import {
  type ValidationRule,
  compose,
  createGuard,
  isDateEarlier,
} from '../core';

import {
  RANGE_DATE_END_EARLIER_START_ERROR_INFO,
  RANGE_DATE_END_INVALID_ERROR_INFO,
  RANGE_DATE_END_REQUIRED_ERROR_INFO,
  RANGE_DATE_REQUIRED_ERROR_INFO,
  RANGE_DATE_START_INVALID_ERROR_INFO,
  RANGE_DATE_START_REQUIRED_ERROR_INFO,
} from './constants';

type RangeDateValue = { start?: Date; end?: Date };

type RangeDateParams = {
  /**
   * Позволяет пометить дату как необязательная
   */
  required?: {
    /**
     * Если `false` дата начала будет не обязательна
     * @default true
     */
    start?: boolean;

    /**
     * Если `false` дата окончания будет не обязательна
     * @default true
     */
    end?: boolean;
  };

  /**
   * Позволяет переопределить дефолтные сообщения об ошибках
   */
  messages?: {
    /**
     * Для даты начала
     */
    startRequired?: string;

    /**
     * Для даты окончания
     */
    endRequired?: string;

    /**
     * Если дата окончания раньше даты начала
     */
    endEarlierStart?: string;
  };
};

/**
 * Guard для интервала дат. Проверяет даты интервала на обязательность заполнения, валидность значений и хронологический порядок
 * @param rules - правила валидаций, применяющиеся к интервалу дат
 * @example
 * ```ts
 * const validate = rangeDate();
 * validate({ start: new Date(), end: new Date() });
 * ```
 */
export const rangeDate = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: ValidationRule<RangeDateValue, TLastSchemaValues>[]
) =>
  createGuard<TLastSchemaValues, RangeDateParams, RangeDateValue>(
    (value, ctx, params) => {
      const { required, messages }: RangeDateParams = {
        ...(params || {}),
        required: {
          start:
            params?.required && 'start' in params?.required
              ? params?.required.start
              : true,
          end:
            params?.required && 'end' in params?.required
              ? params?.required.end
              : true,
        },
      };

      if (required?.start && required?.end && !value.start && !value.end) {
        return ctx.createError({
          message: RANGE_DATE_REQUIRED_ERROR_INFO.message,
          code: RANGE_DATE_REQUIRED_ERROR_INFO.code,
        });
      }

      if (required?.start && !value.start) {
        return ctx.createError({
          message:
            messages?.startRequired ||
            RANGE_DATE_START_REQUIRED_ERROR_INFO.message,
          code: RANGE_DATE_START_REQUIRED_ERROR_INFO.code,
        });
      }

      if (required?.end && !value.end) {
        return ctx.createError({
          message:
            messages?.endRequired || RANGE_DATE_END_REQUIRED_ERROR_INFO.message,
          code: RANGE_DATE_END_REQUIRED_ERROR_INFO.code,
        });
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

      if (value.end && value.start && isDateEarlier(value.end, value.start)) {
        return ctx.createError({
          message:
            messages?.endEarlierStart ||
            RANGE_DATE_END_EARLIER_START_ERROR_INFO.message,
          code: RANGE_DATE_END_EARLIER_START_ERROR_INFO.code,
        });
      }

      return compose<RangeDateValue, TLastSchemaValues>(...rules)(value, ctx);
    },
  );
