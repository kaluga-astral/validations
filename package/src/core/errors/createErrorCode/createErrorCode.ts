import { type ErrorCode } from '../types';

/**
 * Создает уникальный код ошибки
 */
export const createErrorCode = (errorName: string): ErrorCode =>
  `astral-validations-${errorName}`;
