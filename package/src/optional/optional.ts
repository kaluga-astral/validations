import { Guard } from '../core';

/**
 * @description Выключает проверку на required в guard
 * @param guard - правило, проверяющее тип значения
 * @example object({ name: optional(string(min(22))) })
 */
export const optional = <TLastSchemaValues extends Record<string, unknown>>(
  guard: Guard<TLastSchemaValues>,
) => guard.define({ isOptional: true });
