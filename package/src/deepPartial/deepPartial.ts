import { Guard, createRule } from '../core';

/**
 * @description Делает partial все object в схеме, независимо от уровня вложенности правил
 * @param guard - любой guard
 * @example
 * ```ts
 *      const validate = deepPartial(
 *       object({
 *         name: string(),
 *         info: object({
 *           name: string(),
 *           info: object({ name: string() }),
 *         }),
 *       }),
 *     );
 *
 *     // undefined
 *     const result = validate({ info: { info: {} } });
 * ```
 */
export const deepPartial = <TValues>(guard: Guard<TValues>) =>
  createRule<unknown, TValues>((value, prevCtx) =>
    guard(value, {
      ...prevCtx,
      global: {
        ...prevCtx.global,
        overrides: { ...prevCtx.global.overrides, objectIsPartial: true },
      },
    }),
  );
