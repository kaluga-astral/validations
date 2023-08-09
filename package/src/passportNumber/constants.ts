import { ErrorInfo, createErrorCode } from '../core';

export const PASSPORT_NUMBER_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passportNumber'),
  message: 'Проверьте номер',
};

export const PASSPORT_NUMBER_LENGTH_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passportNumber'),
  message: 'Длина поля должна быть равна 6 символам',
};

export const PASSPORT_NUMBER_ONLY_DIGITS_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passportNumber'),
  message: 'Только цифры',
};
