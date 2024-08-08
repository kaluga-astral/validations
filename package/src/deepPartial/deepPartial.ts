import { type Guard, createRule } from '../core';

/**
 * Делает partial все object в схеме, независимо от уровня вложенности правил
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
export const deepPartial = <TLastSchemaValues extends Record<string, unknown>>(
  guard: Guard<TLastSchemaValues>,
) =>
  createRule<unknown, TLastSchemaValues>((value, prevCtx) =>
    guard(value, {
      ...prevCtx,
      global: {
        ...prevCtx.global,
        overrides: { ...prevCtx.global.overrides, objectIsPartial: true },
      },
    }),
  );
