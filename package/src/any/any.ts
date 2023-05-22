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
export const any = <TValues>() => createRule<unknown, TValues>(() => undefined);
