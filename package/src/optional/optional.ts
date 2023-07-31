import { Guard } from '../core';

/**
 * @description Выключает проверку на required в guard
 * @param guard - правило, проверяющее тип значения
 * @example object({ name: optional(string(min(22))) })
 */
export const optional = <TLastSchemeValues extends Record<string, unknown>>(
  guard: Guard<TLastSchemeValues>,
) => guard.define({ isOptional: true });
