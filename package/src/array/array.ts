import {
  UniversalCompositionalValidationRule,
  createArrayError,
  createGuard,
} from '../core';

import { ARRAY_TYPE_ERROR_INFO } from './constants';

/**
 * @description Guard для массива
 * @param rule - правило валидации, которое применится к каждому элементу массива
 * @example
 * ```ts
 * type Item = {
 *   name: string;
 *   age?: number;
 * };
 *
 * const values: Values = [{ name: 'Vasya' }, { name: 'Vasya', age: 22 }];
 *
 * const validateArray = array<Item>(object({
 *   name: string(min(2)),
 *   age: optional(number()),
 * }));
 *
 * // undefined
 * validateArray(values);
 * ```
 */
export const array = <TValues>(rule?: UniversalCompositionalValidationRule) =>
  createGuard<Array<unknown>, TValues>((value, ctx, { typeErrorMessage }) => {
    if (!Array.isArray(value)) {
      return ctx.createError({
        ...ARRAY_TYPE_ERROR_INFO,
        message: typeErrorMessage || ARRAY_TYPE_ERROR_INFO.message,
      });
    }

    if (!rule) {
      return undefined;
    }

    const errorArray = value.map((item) => rule(item, ctx));

    if (errorArray.every((item) => item === undefined)) {
      return undefined;
    }

    return createArrayError(errorArray);
  });
