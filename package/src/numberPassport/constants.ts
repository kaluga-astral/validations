import { ErrorInfo, createErrorCode } from '../core';

export const NUMBER_PASSPORT_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passport-number'),
  message: 'Проверьте номер',
};
