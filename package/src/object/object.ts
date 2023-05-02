import isPlainObject from 'is-plain-obj';

import {
  CompositionalValidationRule,
  ErrorMap,
  Guard,
  ValidationContext,
  createErrorMap,
  createGuard,
} from '../core';
import { optional } from '../optional';

import { isEmptyErrors } from './isEmptyErrors';
import { OBJECT_TYPE_ERROR_INFO } from './constants';

/**
 * @description Специальный итерфейс Guard для object. В данном интерфейсе ctx required
 * Переопределение необходимо для того, чтобы ts показывал, что ctx required в кастомных правилах
 */
interface ObjectPropGuard<TValues> {
  (
    value: Parameters<Guard<unknown, TValues>>[0],
    ctx: ValidationContext<TValues>,
  ): ReturnType<Guard<unknown, TValues>>;
  define: Guard<unknown, TValues>['define'];
}

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

type SchemaValue<TValues> =
  | ObjectPropGuard<TValues>
  | CompositionalValidationRule<unknown, TValues>;

type Schema<TValue extends Record<string, unknown>, TValues> = Record<
  keyof TValue,
  SchemaValue<TValues>
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
 *   customField: (value, ctx) => {
 *     return ctx.createError({ message: 'error', code: Symbol() })
 *   }
 * });
 * ```
 */
export const object = <
  Value extends Record<string, unknown> = NeverSchema,
  TValues = unknown,
>(
  schema: Schema<Value, TValues>,
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
        const schemaEntries = Object.entries<SchemaValue<TValues>>(schema);

        return schemaEntries.reduce<ErrorMap>((errorMap, [key, rule]) => {
          const isGuard = 'define' in rule;

          const callRule =
            isGuard && isPartial
              ? optional(rule as Guard<unknown, TValues>)
              : rule;

          errorMap[key] = callRule(value[key], ctx);

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
