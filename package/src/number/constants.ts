import { type ErrorInfo, createErrorCode } from '../core';

export const NUMBER_TYPE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('number-type'),
  message: 'Не число',
};

export const NAN_NUMBER_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('number-nan'),
  message: 'Некорректное число',
};

export const INFINITY_NUMBER_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('number-infinity'),
  message: 'Бесконечное число',
};
