import { ValidationSimpleError } from '../SimpleError';
import { ErrorInfo } from '../../types';

/**
 * @description Создает простую ошибки валидации. Используется в обычных rules
 */
export const createSimpleError = (error: ErrorInfo): ValidationSimpleError =>
  error;
