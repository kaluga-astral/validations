import { ErrorCode } from '../types';

/**
 * @description Создает уникальный код ошибки по переданному name
 * @param name - уникальное имя ошибки
 * @example
 * ```ts
 *  const STRING_TYPE_ERROR_CODE = createErrorCode('string-type');
 * ```
 */
export const createErrorCode = (name: string): ErrorCode => `revizor-${name}`;
