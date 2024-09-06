import { type ErrorInfo, createErrorCode } from '../core';

export const RANGE_DATE_REQUIRED_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-required'),
  message: 'Укажите период',
};

export const RANGE_DATE_START_REQUIRED_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-startRequired'),
  message: 'Укажите дату начала',
};

export const RANGE_DATE_END_REQUIRED_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-endRequired'),
  message: 'Укажите дату окончания',
};

export const RANGE_DATE_START_INVALID_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-startInvalid'),
  message: 'Дата начала некорректная',
};

export const RANGE_DATE_END_INVALID_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-endInvalid'),
  message: 'Дата окончания некорректная',
};

export const RANGE_DATE_END_EARLIER_START_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('rangedate-endEarlierStart'),
  message: 'Дата окончания не может быть раньше даты начала',
};
