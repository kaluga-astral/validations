import { type ErrorInfo, createErrorCode } from '../core';

export const RANGE_DATE_NOT_EQUAL_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-notequal'),
  message: 'Даты начала и окончания не могут совпадать',
};
