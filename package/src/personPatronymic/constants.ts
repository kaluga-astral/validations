import { type ErrorInfo, createErrorCode } from '../core';

export const PERSON_PATRONYMIC_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('personPatronymic'),
  message: 'Проверьте отчество',
};
