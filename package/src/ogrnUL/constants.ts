import { type ErrorInfo, createErrorCode } from '../core';

export const OGRN_UL_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('ogrnUL'),
  message: 'Проверьте ОГРНЮЛ',
};

export const OGRN_UL_LENGTH = 13;
