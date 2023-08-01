import { ErrorInfo, createErrorCode } from '../core';

export const SURNAME_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('surname'),
  message: 'Проверьте фамилию',
};
