import {
  CompositionalValidationRule,
  ValidationTypes,
  compose,
  createRule,
} from '../core';

type Transformer<TResult> = (value: unknown) => TResult;

/**
 * @description Трансформирует value в новый тип для валидации
 * @param transformer - функция трансформации value в новый тип
 * @param rules - правила, которые будут вызваны после трансформации value
 * @example
 * ```ts
 *  string(
 *    transform(
 *      (value) => new Date(value),
 *      date(min(new Date()))
 *     )
 *  );
 * ```
 */
export const transform = <TResult extends ValidationTypes, TValues>(
  transformer: Transformer<TResult>,
  ...rules: CompositionalValidationRule<TResult, TValues>[]
) =>
  createRule<unknown, TValues>((value, ctx) =>
    compose<TResult, TValues>(...rules)(transformer(value), ctx),
  );
