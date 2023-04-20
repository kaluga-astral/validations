import isPlainObject from 'is-plain-obj';

import {
  CompositionalValidationRule,
  ErrorMap,
  createErrorMap,
  createGuard,
} from '../core';

import { isEmptyErrors } from './isEmptyErrors';
import { OBJECT_TYPE_ERROR_INFO } from './constants';

/**
 * @description Тип, который необходим для того, чтобы object невозможно было использовать без использования generic
 */
type NeverSchema = Record<'__never', never>;

type Schema<TValues extends Record<string, unknown>> = Record<
  keyof TValues,
  CompositionalValidationRule<unknown, unknown>
>;

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

    const generateErrorMap = () => {
      const schemaEntries =
        Object.entries<CompositionalValidationRule<unknown, unknown>>(schema);

      return schemaEntries.reduce<ErrorMap>((errorMap, [key, callRule]) => {
        errorMap[key] = callRule(value, ctx);

        return errorMap;
      }, {});
    };

    const errorMap = generateErrorMap();

    if (!isEmptyErrors(errorMap)) {
      return createErrorMap(errorMap);
    }

    return undefined;
  });
