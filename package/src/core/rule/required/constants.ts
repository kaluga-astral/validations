import { ErrorInfo } from '../../errors';

export const REQUIRED_ERROR_INFO: ErrorInfo = {
  code: Symbol('required'),
  message: 'Обязательно',
};
