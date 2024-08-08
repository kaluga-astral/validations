import { type object } from '../object';

/**
 * Выключает проверку на required для всех полей объекта
 * @param objectGuard
 * @example partial(object({ name: string() }))
 */
export const partial = (objectGuard: ReturnType<typeof object>) =>
  objectGuard.define({ isPartial: true });
