import isPlainObject from 'is-plain-obj';

import {
  ErrorMap,
  Guard,
  ValidationContext,
  ValidationRule,
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
    value: Parameters<Guard<TValues>>[0],
    ctx: ValidationContext<TValues>,
  ): ReturnType<Guard<TValues>>;
  define: Guard<TValues>['define'];
}

type AdditionalDefOptions = {
  /**
   * @description Делает все свойства объекта partial
   */
  isPartial?: boolean;
};

/**
 * @description Возможные значения, принимаемые схемой
 */
export type SchemaValue<TValues> =
  | ObjectPropGuard<TValues>
  | ValidationRule<unknown, TValues>;

/**
 * @description Схема правил валдиации для объекта
 */
export type Schema<
  TValue extends Record<string, unknown>,
  TValues = unknown,
> = Record<keyof TValue, SchemaValue<TValues>>;

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
 *     return ctx.createError({ message: 'error', code: 'custom error' })
 *   }
 * });
 * ```
 */
export const object = <
  Value extends Record<string, unknown>,
  TValues = unknown,
>(
  schema: Schema<Value, TValues>,
) =>
  createGuard<TValues, AdditionalDefOptions>(
    (value, ctx, { typeErrorMessage, isPartial }) => {
      if (!isPlainObject(value)) {
        return ctx.createError({
          ...OBJECT_TYPE_ERROR_INFO,
          message: typeErrorMessage || OBJECT_TYPE_ERROR_INFO.message,
        });
      }

      const generateErrorMap = () => {
        const schemaEntries = Object.entries<SchemaValue<TValues>>(schema);
        const isOptional = ctx.global.overrides.objectIsPartial || isPartial;

        return schemaEntries.reduce<ErrorMap>((errorMap, [key, rule]) => {
          const isGuard = 'define' in rule;

          const callRule =
            isGuard && isOptional ? optional(rule as Guard<TValues>) : rule;

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
