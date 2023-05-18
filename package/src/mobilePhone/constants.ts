import { ErrorInfo, createErrorCode } from '../core';

export const MOBILE_PHONE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('mobilePhone'),
  message: 'Некорректный номер телефона',
};

export const MOBILE_PHONE_REGEX = /^(79)\d{9}$/;
