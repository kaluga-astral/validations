import { type ErrorInfo, createErrorCode } from '../core';

export const INN_12_SYMBOLS_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('innTwelveSymbols'),
  message: 'Некорректный ИНН',
};

export const INN_12_SYMBOLS_LENGTH = 12;

export const FIRST_INN_12_SYMBOLS_DECODING = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

export const SECOND_INN_12_SYMBOLS_DECODING = [
  3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8,
];
