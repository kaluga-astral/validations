import { ValidationRule, ValidationTypes, compose, createRule } from '../core';

type Transformer<TValue, TResult> = (value: TValue) => TResult;

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
export const transform = <
  TValue extends ValidationTypes,
  TResult extends ValidationTypes,
  TValues,
>(
  transformer: Transformer<TValue, TResult>,
  ...rules: ValidationRule<TResult, TValues>[]
) =>
  createRule<TValue, TValues>((value, ctx) =>
    compose<TResult, TValues>(...rules)(transformer(value), ctx),
  );
