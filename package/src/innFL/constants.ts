import { type ErrorInfo, createErrorCode } from '../core';

export const INN_FL_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('innFL'),
  message: 'Некорректный ИНН ФЛ',
};
