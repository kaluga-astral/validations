import { ErrorInfo, createErrorCode } from '../core';

export const INVALID_KPP_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('kpp-invalid'),
  message: 'Некорректный КПП',
};

export const KPP_REGEX = /^(\d{4}([A-Z]|\d){2}\d{3})$/;
