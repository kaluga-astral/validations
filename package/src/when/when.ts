import { ValidationContext, ValidationRule, createRule } from '../core';

type Params<TLastSchemeValues extends Record<string, unknown>> = {
  /**
   * @description Условие для выбора ветки
   */
  is: (value: unknown, ctx: ValidationContext<TLastSchemeValues>) => boolean;
  /**
   * Правила валидации, применяемые если is === true
   */
  then: ValidationRule<unknown, TLastSchemeValues>;
  /**
   * Правила валидации, применяемые если is === false
   */
  otherwise: ValidationRule<unknown, TLastSchemeValues>;
};

/**
 * @description Позволяет указывать условные валидации
 * @example
 * ```ts
 * type Values = { name: string; isAgree: boolean };
 *
 * const validate = object<Values, Values>({
 *   name: when({
 *     is: (_, ctx) => ctx.global.values.isAgree,
 *     then: string(),
 *     otherwise: any(),
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
export const when = <TLastSchemeValues extends Record<string, unknown>>({
  is,
  then,
  otherwise,
}: Params<TLastSchemeValues>) =>
  createRule<unknown, TLastSchemeValues>((value, ctx) => {
    if (is(value, ctx)) {
      return then(value, ctx);
    }

    return otherwise(value, ctx);
  });
