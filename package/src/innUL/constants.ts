import { type ErrorInfo, createErrorCode } from '../core';

export const INN_UL_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('innUL'),
  message: 'Проверьте ИНН',
};

export const INN_UL_LENGTH = 10;

export const INN_UL_DECODING = [2, 4, 10, 3, 5, 9, 4, 6, 8];
