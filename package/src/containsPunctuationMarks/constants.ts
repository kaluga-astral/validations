import { type ErrorCode, createErrorCode } from '../core';

export const CONTAINS_PUNCTUATION_MARKS_ERROR_CODE: ErrorCode = createErrorCode(
  'containsPunctuationMarks',
);
