import { ErrorInfo, createErrorCode } from '../core';

export const ARRAY_TYPE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('array'),
  message: 'Не является массивом',
};
