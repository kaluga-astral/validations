import { type ErrorInfo, createErrorCode } from '../core';

export const INN_IP_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('innIP'),
  message: 'Проверьте ИНН',
};
