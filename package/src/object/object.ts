import isPlainObject from 'is-plain-obj';

import { OBJECT_TYPE_ERROR_INFO, ValidationRule, createGuard } from '../core';

/**
 * @description Тип, который необходим для того, чтобы object невозможно было использовать без использования generic
 */
type NeverSchema = Record<'__never', never>;

type Schema<TValues extends object> = {
  [P in keyof TValues]: ValidationRule<TValues[P], TValues>;
};

/**
 * @description Guard для объекта
 * @param schema - схема валидации объекта
 * @example
 * ```ts
 * type Values = {
 *   name: string;
 *   age?: number;
 *   info: { surname: string };
 * };
 *
 * const values: Values = { name: 'Vasya', info: { surname: 'Vasin' } };
 *
 * const validateObject = object<Values>({
 *   name: string(min(2)),
 *   age: optional(number()),
 *   info: object<Values['info']>({ surname: string(min(2)) }),
 * });
 * ```
 */
export const object = <
  Value extends Record<string, unknown> = NeverSchema,
  TValues = unknown,
>(
  schema: Schema<Value>,
) =>
  createGuard<Value, TValues>((value, ctx, { typeErrorMessage }) => {
    if (!isPlainObject(value)) {
      return ctx.createError({
        ...OBJECT_TYPE_ERROR_INFO,
        message: typeErrorMessage || OBJECT_TYPE_ERROR_INFO.message,
      });
    }

    Object.entries(schema).reduce((errorObject) => {}, {});

    return undefined;
  });
