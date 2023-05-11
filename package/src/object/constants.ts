import { ErrorInfo, createErrorCode } from '../core';

export const OBJECT_TYPE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('object'),
  message: 'Не является объектом',
};
