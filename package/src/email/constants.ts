import { type ErrorInfo, createErrorCode } from '../core';

export const EMAIL_REGEXP = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,}$/;

export const EMAIL_MAX_LENGTH = 256;

export const INVALID_EMAIL_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('email-invalid'),
  message: 'Некорректный E-mail',
};

export const LENGTH_EMAIL_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('email-length'),
  message: 'E-mail слишком длинный',
};
