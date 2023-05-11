import { ErrorInfo, createErrorCode } from '../../errors';

export const REQUIRED_ERROR_INFO: ErrorInfo = {
  code: createErrorCode('required'),
  message: 'Обязательно',
};
