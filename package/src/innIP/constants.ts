import { ErrorInfo, createErrorCode } from '../core';

export const INN_IP_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('innIP'),
  message: 'Некорректный ИНН ИП',
};

export const INN_IP_LENGTH = 12;

export const FIRST_INN_IP_DECODING = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

export const SECOND_INN_IP_DECODING = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
