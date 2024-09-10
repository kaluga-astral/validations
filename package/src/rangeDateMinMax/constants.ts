import { type ErrorInfo, createErrorCode } from '../core';

import type { DefaultMessage, Field } from './types';

type DynamicErrorInfo = Pick<ErrorInfo, 'code'> & {
  message: DefaultMessage;
};

const DEFAULT_FIELD_NAME = {
  start: 'начала',
  end: 'окончания',
};

export const RANGE_DATE_MIN_ERROR_INFO: DynamicErrorInfo = {
  code: createErrorCode('rangedate-min'),
  message: (field: Field, minDate: string) =>
    `Дата ${DEFAULT_FIELD_NAME[field]} должна быть позже ${minDate}`,
};

export const RANGE_DATE_MAX_ERROR_INFO: DynamicErrorInfo = {
  code: createErrorCode('rangedate-max'),
  message: (field: Field, maxDate: string) =>
    `Дата ${DEFAULT_FIELD_NAME[field]} должна быть раньше ${maxDate}`,
};
