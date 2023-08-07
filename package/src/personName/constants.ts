import { ErrorInfo, createErrorCode } from '../core';

export const PERSON_NAME_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('personName'),
  message: 'Проверьте имя',
};
