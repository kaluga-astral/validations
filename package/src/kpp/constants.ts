import { ErrorInfo, createErrorCode } from '../core';

export const KPP_PATTERN_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('kpp-invalid-pattern'),
  message: 'Проверьте КПП',
};

export const KPP_ZEROS_ONLY_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('kpp-invalid-zeros-only'),
  message: 'Не может состоять только из нулей',
};

export const KPP_DOUBLE_ZERO_START_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('kpp-invalid-double-zero-start'),
  message: 'Не может начинаться с 00',
};

export const KPP_REGEX = /^(\d{4}([A-Z]|\d){2}\d{3})$/;
