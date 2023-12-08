import { type ErrorInfo, createErrorCode } from '../core';

export const TEXT_FIELD_REGEXP =
  /^[a-zA-Zа-яА-Я0-9\s!@#$%^&*()-_=+\\|[\]{};:'",.<>/?]+$/;

export const TEXT_FIELD_MAX_LENGTH = 256;

export const INVALID_TEXT_FIELD_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('textField-invalid'),
  message: 'Содержит запрещённые символы',
};

export const LENGTH_TEXT_FIELD_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('textField-length'),
  message: 'Превышено максимальное кол-во символов',
};
