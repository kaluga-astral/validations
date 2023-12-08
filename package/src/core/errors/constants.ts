import { type ErrorInfo } from './types';
import { createErrorCode } from './createErrorCode';

export const REJECT_PROMISE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('reject-promise'),
  message: 'Неизвестная ошибка',
};
