import { ErrorInfo, createErrorCode } from '../core';

export const PERSON_SURNAME_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('personSurname'),
  message: 'Проверьте фамилию',
};
