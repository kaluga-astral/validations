import { type ErrorCode, createErrorCode } from '../core';

export const STRING_MAX_ERROR_CODE: ErrorCode = createErrorCode('string-max');

export const NUMBER_MAX_ERROR_CODE: ErrorCode = createErrorCode('number-max');

export const DATE_MAX_ERROR_CODE: ErrorCode = createErrorCode('date-max');

export const ARRAY_MAX_ERROR_CODE: ErrorCode = createErrorCode('array-max');
