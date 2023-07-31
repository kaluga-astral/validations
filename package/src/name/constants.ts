import { ErrorInfo, createErrorCode } from '../core';

export const NAME_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('name'),
  message: 'Проверьте имя',
};

export const RESTRICTED_VALUES = [];
