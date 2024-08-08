import { ValidationSimpleError } from '../SimpleError';
import { type ErrorInfo } from '../../types';

/**
 * Создает простую ошибки валидации. Используется в обычных rules
 */
export const createSimpleError = ({ message, code }: ErrorInfo) =>
  new ValidationSimpleError(message, { cause: { code } });
