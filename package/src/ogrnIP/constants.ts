import { type ErrorInfo, createErrorCode } from '../core';

export const OGRN_IP_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('ogrnIP'),
  message: 'Некорректный ОГРН ИП',
};

export const OGRN_IP_LENGTH = 15;
