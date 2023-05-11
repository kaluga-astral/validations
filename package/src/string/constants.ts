import { ErrorInfo, createErrorCode } from '../core';

export const STRING_TYPE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('string'),
  message: 'Не является строкой',
};
