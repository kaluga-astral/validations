import { ValidationContext, ValidationRule, createRule } from '../core';

type Params<TValues> = {
  /**
   * @description Условие для выбора ветки
   */
  is: (value: unknown, ctx: ValidationContext<TValues>) => boolean;
  /**
   * Правила валидации, применяемые если is === true
   */
  then: ValidationRule<unknown, TValues>;
  /**
   * Правила валидации, применяемые если is === false
   */
  otherwise: ValidationRule<unknown, TValues>;
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
export const when = <TValues>({ is, then, otherwise }: Params<TValues>) =>
  createRule<unknown, TValues>((value, ctx) => {
    if (is(value, ctx)) {
      return then(value, ctx);
    }

    return otherwise(value, ctx);
  });
