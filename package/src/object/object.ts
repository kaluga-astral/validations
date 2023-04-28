import isPlainObject from 'is-plain-obj';

import { ErrorMap, Guard, createErrorMap, createGuard } from '../core';
import { optional } from '../optional';

import { isEmptyErrors } from './isEmptyErrors';
import { OBJECT_TYPE_ERROR_INFO } from './constants';

type AdditionalDefOptions = {
  /**
   * @description Делает все свойства объекта partial
   */
  isPartial?: boolean;
};

/**
 * @description Тип, который необходим для того, чтобы object невозможно было использовать без использования generic
 */
type NeverSchema = Record<'__never', never>;

type SchemaValue = Guard<unknown, unknown>;

type Schema<TValues extends Record<string, unknown>> = Record<
  keyof TValues,
  SchemaValue
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
  createGuard<Value, TValues, AdditionalDefOptions>(
    (value, ctx, { typeErrorMessage, isPartial }) => {
      if (!isPlainObject(value)) {
        return ctx.createError({
          ...OBJECT_TYPE_ERROR_INFO,
          message: typeErrorMessage || OBJECT_TYPE_ERROR_INFO.message,
        });
      }

      const generateErrorMap = () => {
        const schemaEntries = Object.entries<SchemaValue>(schema);

        return schemaEntries.reduce<ErrorMap>((errorMap, [key, guard]) => {
          const callGuard = isPartial ? optional(guard) : guard;

          errorMap[key] = callGuard(value[key], ctx);

          return errorMap;
        }, {});
      };

      const errorMap = generateErrorMap();

      if (!isEmptyErrors(errorMap)) {
        return createErrorMap(errorMap);
      }

      return undefined;
    },
  );
