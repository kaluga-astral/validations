import {
  CompositionalValidationRule,
  ValidationTypes,
  compose,
  createArrayError,
  createRule,
} from '../core';

/**
 * @description Применяет правила к каждому элементу массива
 * @param rules - правила валидации, которое применится к каждому элементу массива
 * @example
 * ```ts
 * type Item = {
 *   name: string;
 *   age?: number;
 * };
 *
 * const values: Values = [{ name: 'Vasya' }, { name: 'Vasya', age: 22 }];
 *
 * const validateArray = array(
 *   arrayItem(
 *     object<Item>({
 *       name: string(min(2)),
 *       age: optional(number()),
 *     }),
 *   ),
 * );
 *
 * // undefined
 * validateArray(values);
 * ```
 */
export const arrayItem = <TItem extends ValidationTypes, TValues = unknown>(
  ...rules: CompositionalValidationRule<TItem, TValues>[]
) =>
  createRule<Array<TItem>, TValues>((array, ctx) => {
    const validationItemsResult = array.map((item) =>
      compose<TItem, TValues>(...rules)(item, ctx),
    );

    if (validationItemsResult.some((result) => result !== undefined)) {
      return createArrayError(validationItemsResult);
    }

    return undefined;
  });
