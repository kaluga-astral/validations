import isPlainObject from 'is-plain-obj';
import { DeepPartial } from 'utility-types';

import {
  ErrorMap,
  Guard,
  ValidationContext,
  ValidationRule,
  callRule as callRecursiveRule,
  createContext,
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
interface ObjectPropGuard<TLastSchemaValues extends Record<string, unknown>> {
  (
    value: Parameters<Guard<TLastSchemaValues>>[0],
    ctx: ValidationContext<TLastSchemaValues>,
  ): ReturnType<Guard<TLastSchemaValues>>;
  define: Guard<TLastSchemaValues>['define'];
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
export type SchemaValue<TValue extends Record<string, unknown>> =
  | ObjectPropGuard<TValue>
  | ValidationRule<unknown, TValue>;

/**
 * @description Схема правил валдиации для объекта
 */
export type Schema<TValue extends Record<string, unknown>> = Record<
  keyof TValue,
  SchemaValue<TValue>
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
 *     return ctx.createError({ message: 'error', code: 'custom error' })
 *   }
 * });
 * ```
 */
export const object = <
  TValue extends Record<string, unknown>,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  schema: Schema<TValue>,
) =>
  createGuard<TLastSchemaValues, AdditionalDefOptions>(
    (value, ctx, { typeErrorMessage, isPartial }) => {
      const context = createContext<TValue, TValue>(ctx, value as TValue, {
        lastSchemaValue: value as DeepPartial<TValue>,
      });

      if (!isPlainObject(value)) {
        return context.createError({
          ...OBJECT_TYPE_ERROR_INFO,
          message: typeErrorMessage || OBJECT_TYPE_ERROR_INFO.message,
        });
      }

      const generateErrorMap = () => {
        const schemaEntries = Object.entries<SchemaValue<TValue>>(schema);
        const isOptional =
          context.global.overrides.objectIsPartial || isPartial;

        return schemaEntries.reduce<ErrorMap>((errorMap, [key, rule]) => {
          const isGuard = 'define' in rule;

          const callRule =
            isGuard && isOptional ? optional(rule as Guard<TValue>) : rule;

          errorMap[key] = callRecursiveRule(callRule, value[key], context);

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

export type ObjectGuard<TValue extends Record<string, unknown>> = ReturnType<
  typeof object<TValue>
>;
