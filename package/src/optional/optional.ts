import { Guard } from '../core';

/**
 * @description Выключает проверку на required в guard
 * @param guard - правило, проверяющее тип значения
 * @example object({ name: optional(string(min(22))) })
 */
export const optional = <TLastSchemфValues extends Record<string, unknown>>(
  guard: Guard<TLastSchemфValues>,
) => guard.define({ isOptional: true });
