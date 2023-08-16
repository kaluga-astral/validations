import { ErrorInfo, createErrorCode } from '../core';

export const GUID_REGEXP =
  /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

export const INVALID_GUID_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('guid-invalid'),
  message: 'Некорректный GUID',
};
