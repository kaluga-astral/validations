import { ErrorCode } from '../types';

/**
 * @description Создает уникальный код ошибки
 */
export const createErrorCode = (errorName: string): ErrorCode =>
  `astral-validations-${errorName}`;
