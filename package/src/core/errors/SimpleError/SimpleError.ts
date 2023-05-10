import { ErrorCode } from '../types';

/**
 * @description Простая ошибка правил валидации. Не имеет вложенных ошибок
 */
export type ValidationSimpleError = {
  message: string;
  /**
   * @description Уникальный код ошибки
   */
  code: ErrorCode;
};
