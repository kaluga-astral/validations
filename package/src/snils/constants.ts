import { type ErrorInfo, createErrorCode } from '../core';

export const SNILS_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('snils'),
  message: 'Некорректный СНИЛС',
};

export const RESTRICTED_VALUES = ['00000000000'];

export const DEFAULT_CHECKED_SUM = [0, 100, 101];
