import { type ErrorInfo, createErrorCode } from '../core';

export const OGRN_IP_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('ogrnIP'),
  message: 'Проверьте ОГРНИП',
};

export const OGRN_IP_LENGTH = 15;
