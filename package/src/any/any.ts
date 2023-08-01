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
export const any = <TLastSchemфValues extends Record<string, unknown>>() =>
  createRule<unknown, TLastSchemфValues>(() => undefined);
