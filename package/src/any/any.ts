import { ValidationRule, compose, createRule } from '../core';

/**
 * @description Выключает любые проверки и валидирует value
 * @param rules - правила, валидирующие string или unknown value
 * @example
 * ```ts
 *   type Values = { name: string; surname?: string };
 *
 *   const validate = object<Values>({ name: any(), surname: any() });
 *
 *   // undefined
 *   validate({});
 * ```
 *   const validate = any(transform((value) => new Date(value), date()));
 *
 *    // undefined
 *    validate('12.22.2022');
 *
 *    // invalid date error
 *    validate('13.22.2022');
 * ```
 */

export const any = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: ValidationRule<unknown, TLastSchemaValues>[]
) =>
  createRule<unknown, TLastSchemaValues>((value, ctx) => {
    return compose<unknown, TLastSchemaValues>(...rules)(value, ctx);
  });
