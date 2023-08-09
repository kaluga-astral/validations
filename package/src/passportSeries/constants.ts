import { ErrorInfo, createErrorCode } from '../core';

export const PASSPORT_SERIES_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passportSeries'),
  message: 'Проверьте серию',
};

export const PASSPORT_SERIES_ERROR_LENGTH_INFO: ErrorInfo = {
  code: createErrorCode('passportSeries'),
  message: 'Длина поля должна быть равна 4 символам',
};

export const PASSPORT_SERIES_ONLY_DIGITS_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('passportSeries'),
  message: 'Только цифры',
};
