import { any } from '../any';
import {
  type ValidationContext,
  type ValidationRule,
  callRule,
  createRule,
} from '../core';

type Params<TLastSchemaValues extends Record<string, unknown>> = {
  /**
   * @description Условие для включения схемы
   */
  is: (value: unknown, ctx: ValidationContext<TLastSchemaValues>) => boolean;
  /**
   * Правило валидации, применяемая если is === true
   */
  then: ValidationRule<unknown, TLastSchemaValues>;
};

/**
 * @description Позволяет указывать условные валидации
 * @example
 * ```ts
 * type Values = { name: string; isAgree: boolean };
 *
 * const validate = object<Values>({
 *   name: enabled({
 *     is: (_, ctx) => ctx.global.values.isAgree,
 *     then: string(),
 *   }),
 *   isAgree: optional(boolean()),
 * });
 *
 * // undefined
 * const result1 = validate({ isAgree: false, name: '' });
 *
 * // Required error для name
 * const result2 = validate({ isAgree: true, name: '' });
 * ```
 */
export const enabled = <TLastSchemaValues extends Record<string, unknown>>({
  is,
  then,
}: Params<TLastSchemaValues>) => {
  return createRule<unknown, TLastSchemaValues>((value, ctx) => {
    if (is(value, ctx)) {
      return callRule(then, value, ctx);
    }

    return callRule(any(), value, ctx);
  });
};
