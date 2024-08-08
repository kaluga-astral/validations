import isPlainObject from 'is-plain-obj';
import { type DeepPartial } from 'utility-types';

import {
  type AsyncGuard,
  type AsyncValidationRule,
  type ErrorMap,
  type Guard,
  type ValidationContext,
  type ValidationRule,
  callAsyncRule as callAsyncRecursiveRule,
  createContext,
  createErrorMap,
  createGuard,
} from '../../core';
import { optionalAsync } from '../../optional';
import { isEmptyErrors } from '../isEmptyErrors';
import { OBJECT_TYPE_ERROR_INFO } from '../constants';

/**
 * Специальный итерфейс Guard для object. В данном интерфейсе ctx required
 * Переопределение необходимо для того, чтобы ts показывал, что ctx required в кастомных правилах
 */
interface ObjectPropGuard<TLastSchemaValues extends Record<string, unknown>> {
  (
    value: Parameters<Guard<TLastSchemaValues>>[0],
    ctx: ValidationContext<TLastSchemaValues>,
  ): ReturnType<Guard<TLastSchemaValues>>;
  define: Guard<TLastSchemaValues>['define'];
}
interface AsyncObjectPropGuard<
  TLastSchemaValues extends Record<string, unknown>,
> {
  (
    value: Parameters<Guard<TLastSchemaValues>>[0],
    ctx: ValidationContext<TLastSchemaValues>,
  ): ReturnType<AsyncGuard<TLastSchemaValues>>;
  define: AsyncGuard<TLastSchemaValues>['define'];
}

type AdditionalDefOptions = {
  /**
   * Делает все свойства объекта partial
   */
  isPartial?: boolean;
};

/**
 * Возможные значения, принимаемые схемой
 */
export type AsyncSchemaValue<TValue extends Record<string, unknown>> =
  | ObjectPropGuard<TValue>
  | AsyncObjectPropGuard<TValue>
  | ValidationRule<unknown, TValue>
  | AsyncValidationRule<unknown, TValue>;

/**
 * Схема правил валдиации для объекта
 */
export type AsyncSchema<TValue extends Record<string, unknown>> = Record<
  keyof TValue,
  AsyncSchemaValue<TValue>
>;

// TODO: необходимо реализовать переиспользование логики между object и objectAsync

/**
 * Guard для объекта, который поддерживает асинхронную валидацию
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
 * const validateObject = objectAsync<Values>({
 *   name: string(min(2), async (value, ctx) => {
 *     const result = await validateName(value);
 *
 *     return result.isInvalid
 *       ? ctx.createError({
 *           message: 'Имя занято',
 *           code: 'name-is-not-available',
 *         })
 *       : undefined;
 *   }),
 *   age: optional(number()),
 *   info: object<Values['info']>({ surname: string(min(2)) }),
 *   customField: (value, ctx) => {
 *     return ctx.createError({ message: 'error', code: 'custom error' });
 *   },
 * });
 * ```
 */
export const objectAsync = <
  TValue extends Record<string, unknown>,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  schema: AsyncSchema<TValue>,
) =>
  createGuard<TLastSchemaValues, AdditionalDefOptions>(
    async (value, ctx, { typeErrorMessage, isPartial }) => {
      const context = createContext<TValue, TValue>(ctx, value as TValue, {
        lastSchemaValue: value as DeepPartial<TValue>,
      });

      if (!isPlainObject(value)) {
        return context.createError({
          ...OBJECT_TYPE_ERROR_INFO,
          message: typeErrorMessage || OBJECT_TYPE_ERROR_INFO.message,
        });
      }

      const generateErrorMap = async () => {
        const schemaEntries = Object.entries<AsyncSchemaValue<TValue>>(schema);
        const isOptional =
          context.global.overrides.objectIsPartial || isPartial;

        const results = await Promise.all(
          schemaEntries.map(([key, rule]) => {
            const callRule = isOptional ? optionalAsync(rule) : rule;

            return callAsyncRecursiveRule(callRule, value[key], context);
          }),
        );

        return results.reduce<ErrorMap>((errorMap, validationResult, index) => {
          const [key] = schemaEntries[index];

          errorMap[key] = validationResult;

          return errorMap;
        }, {});
      };

      const errorMap = await generateErrorMap();

      if (!isEmptyErrors(errorMap)) {
        return createErrorMap(errorMap);
      }

      return undefined;
    },
  );

export type ObjectAsyncGuard<TValue extends Record<string, unknown>> =
  ReturnType<typeof objectAsync<TValue>>;
