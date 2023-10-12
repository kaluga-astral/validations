import { createRule } from '../core';

import {
  BIRTH_DATE_MAX_ERROR_CODE,
  BIRTH_DATE_MIN,
  BIRTH_DATE_MIN_ERROR_CODE,
} from './constants';

type MinYearsOldParams = {
  /**
   * @description Кастомное сообщение ошибки
   */
  customErrorMessage: string;
};

/**
 * @description Проверяет дату рождения на соответствие условию. Работает с date.
 * @param age - ограничение по возрасту (коло-во лет, вычитаемое из текущей даты для валидации)
 * @param params - объект параметров
 * @example
 * ```ts

 *
 *  const validate = date(
 *   minYearsOld(18, {
 *     customMessage:
 *             'Только совершеннолетние могут воспользоваться данной услугой',
 *   }),
 * );
 * ```
 */
export function minYearsOld<
  ValidationType,
  TLastSchemaValues extends Record<string, unknown> = {},
>(age: number, params?: MinYearsOldParams) {
  return createRule<ValidationType, TLastSchemaValues>((value, ctx) => {
    const getMessage = (typeMessage: string) => {
      const message = params?.customErrorMessage;

      return message ? message : typeMessage;
    };

    const threshold = new Date();

    threshold.setFullYear(threshold.getFullYear() - age);

    if (value instanceof Date && value > BIRTH_DATE_MIN) {
      if (value > threshold) {
        return ctx.createError({
          code: BIRTH_DATE_MAX_ERROR_CODE,
          message: getMessage(`Вам должно быть больше ${age} лет`),
        });
      }

      return undefined;
    }

    if (value < BIRTH_DATE_MIN) {
      return ctx.createError({
        code: BIRTH_DATE_MIN_ERROR_CODE,
        message: getMessage(`Не ранее ${BIRTH_DATE_MIN}`),
      });
    }

    return undefined;
  });
}
