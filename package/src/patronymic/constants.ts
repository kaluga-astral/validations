import { ErrorInfo, createErrorCode } from '../core';

export const PATRONYMIC_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('patronymic'),
  message: 'Проверьте отчество',
};

export const RESTRICTED_VALUES = [];
