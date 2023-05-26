import { Guard } from '../core';

/**
 * @description Выключает проверку на required в guard
 * @param guard - правило, проверяющее тип значения
 * @example object({ name: optional(string(min(22))) })
 */
export const optional = <TValues>(guard: Guard<TValues>) =>
  guard.define({ isOptional: true });
