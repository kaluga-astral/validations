import { ErrorInfo } from '../core';

export const ARRAY_TYPE_ERROR_INFO: ErrorInfo = {
  code: Symbol('array'),
  message: 'Не является массивом',
};
