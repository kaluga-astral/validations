import { ErrorInfo, createErrorCode } from '../core';

export const POSITIVE_NUMBER_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('positive-number'),
  message: 'Только положительные числа',
};
