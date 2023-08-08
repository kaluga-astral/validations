import { ErrorInfo, createErrorCode } from '../core';

export const CODE_PASSPORT_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passport-code'),
  message: 'Проверьте код',
};
