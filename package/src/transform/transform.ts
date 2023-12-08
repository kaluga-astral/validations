import {
  type ValidationRule,
  type ValidationTypes,
  compose,
  createRule,
} from '../core';

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
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  transformer: Transformer<TValue, TResult>,
  ...rules: ValidationRule<TResult, TLastSchemaValues>[]
) =>
  createRule<TValue, TLastSchemaValues>((value, ctx) =>
    compose<TResult, TLastSchemaValues>(...rules)(transformer(value), ctx),
  );
