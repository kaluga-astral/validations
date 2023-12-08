import { type ErrorInfo, createErrorCode } from '../core';

export const BOOLEAN_TYPE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('boolean-type'),
  message: 'Не boolean',
};
