import { ErrorInfo } from '../core';

export const OBJECT_TYPE_ERROR_INFO: ErrorInfo = {
  code: Symbol('object'),
  message: 'Не является объектом',
};
