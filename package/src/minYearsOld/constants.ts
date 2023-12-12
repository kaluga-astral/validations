import { type ErrorCode, createErrorCode } from '../core';

export const BIRTH_DATE_MAX_ERROR_CODE: ErrorCode =
  createErrorCode('birth-date-max');

export const BIRTH_DATE_MIN_ERROR_CODE: ErrorCode =
  createErrorCode('birth-date-min');

export const BIRTH_DATE_MIN = new Date('01.01.1900');
