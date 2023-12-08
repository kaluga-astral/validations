import { type ErrorInfo, createErrorCode } from '../core';

export const PASSPORT_CODE_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passportCode'),
  message: 'Проверьте код',
};

export const PASSPORT_CODE_LENGTH_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passportCode'),
  message: 'Длина поля должна быть равна 6 символам',
};

export const PASSPORT_CODE_ONLY_DIGITS_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passportCode'),
  message: 'Только цифры',
};
