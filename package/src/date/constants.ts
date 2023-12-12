import { type ErrorInfo, createErrorCode } from '../core';

export const DATE_TYPE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('date-type'),
  message: 'Не дата',
};

export const INVALID_DATE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('invalid-date'),
  message: 'Некорректная дата',
};
