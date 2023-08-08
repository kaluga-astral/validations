import { ErrorInfo, createErrorCode } from '../core';

export const SERIES_PASSPORT_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passport-series'),
  message: 'Проверьте серию',
};
