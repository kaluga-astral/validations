import { CommonRuleParams, createRule, isStringOfZeros } from '../core';

import {
  DEFAULT_CHECKED_SUM,
  RESTRICTED_VALUES,
  SNILS_ERROR_INFO,
} from './constants';

type SnilsParams = {
  /**
   * @description Замена стандартного сообщения ошибки.
   */
  message?: string;
  /**
   * @description Позволяет указать значение  в качестве исключения из правил.
   */
  exclude?: CommonRuleParams<string>['exclude'];
};

const removeSpecialCharacters = (value: string) => {
  return value.replace(/\D/g, '');
};

const calcCheckSumForSNILS = (digitsOfValue: string) =>
  digitsOfValue
    .slice(0, 9)
    .split('')
    .map(Number)
    .reduce((sum, currentValue, index) => sum + currentValue * (9 - index), 0);

const compareCheckSum = (calculatedCheckSum: number, checkSum: number) => {
  return (
    calculatedCheckSum % DEFAULT_CHECKED_SUM[2] === checkSum ||
    (calculatedCheckSum % DEFAULT_CHECKED_SUM[2] === DEFAULT_CHECKED_SUM[1] &&
      checkSum === DEFAULT_CHECKED_SUM[0])
  );
};

/**
 * @description Проверяет валиден ли СНИЛС
 * @example isSNILS()('95145370513');
 */
export const snils = <TValues>({ message, exclude }: SnilsParams = {}) =>
  createRule<string, TValues>(
    (value, ctx) => {
      const createSnilsError = () =>
        ctx.createError({
          message: message || SNILS_ERROR_INFO.message,
          code: SNILS_ERROR_INFO.code,
        });

      if (isStringOfZeros(value)) {
        return createSnilsError();
      }

      const formattedValue = removeSpecialCharacters(value);

      if (formattedValue.length !== value.length) {
        return createSnilsError();
      }

      if (!/^(\d{11})$/.test(formattedValue)) {
        return createSnilsError();
      }

      if (RESTRICTED_VALUES.includes(formattedValue)) {
        return createSnilsError();
      }

      const checkSum = Number(formattedValue.slice(9, 11));
      const calculatedCheckSum = calcCheckSumForSNILS(formattedValue);

      if (calculatedCheckSum < DEFAULT_CHECKED_SUM[1]) {
        if (calculatedCheckSum === checkSum) {
          return undefined;
        }

        return createSnilsError();
      }

      if (
        calculatedCheckSum === DEFAULT_CHECKED_SUM[1] ||
        calculatedCheckSum === DEFAULT_CHECKED_SUM[2]
      ) {
        if (checkSum === DEFAULT_CHECKED_SUM[0]) {
          return undefined;
        }

        return createSnilsError();
      }

      if (calculatedCheckSum > DEFAULT_CHECKED_SUM[2]) {
        if (compareCheckSum(calculatedCheckSum, checkSum)) {
          return undefined;
        }

        return createSnilsError();
      }

      return undefined;
    },
    { exclude },
  );
