import { type ErrorInfo, createErrorCode } from '../core';

const DEFAULT_FIELD_NAME = {
  start: 'начала',
  end: 'окончания',
};

export const RANGE_DATE_MIN_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-min'),
  message: (field: 'start' | 'end', minDate: string) =>
    `Дата ${DEFAULT_FIELD_NAME[field]} должна быть позже ${minDate}`,
};

export const RANGE_DATE_MAX_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-max'),
  message: (field: 'start' | 'end', maxDate: string) =>
    `Дата ${DEFAULT_FIELD_NAME[field]} должна быть раньше ${maxDate}`,
};
