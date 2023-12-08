import { type ErrorInfo, createErrorCode } from '../core';

export const INTEGER_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('integer'),
  message: 'Только целые числа',
};
