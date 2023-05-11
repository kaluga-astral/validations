import { ErrorInfo } from '../core';

export const STRING_TYPE_ERROR_INFO: ErrorInfo = {
  code: Symbol('string'),
  message: 'Не является строкой',
};
