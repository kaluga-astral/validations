import { createRule } from '../core';

/**
 * @description Выключает любые проверки
 * @example
 * ```ts
 *   type Values = { name: string; surname?: string };
 *
 *   const validate = object<Values>({ name: any(), surname: any() });
 *
 *   // undefined
 *   validate({});
 * ```
 */
export const any = <TLastSchemaValues extends Record<string, unknown>>() =>
  createRule<unknown, TLastSchemaValues>(() => undefined);
