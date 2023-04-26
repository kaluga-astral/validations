import isEmpty from 'lodash.isempty';

import { createRule } from '../createRule';

import { REQUIRED_ERROR_INFO } from './constants';

/**
 * @description Проверяет value на пустоту. Если значение пустое, то возвращает ошибку.
 * Правило универсально для всех типов данных
 */
export const required = ({
  message,
}: {
  /**
   * @description Кастомное сообщение ошибки
   * @default Обязательно
   */
  message?: string;
} = {}) =>
  createRule<unknown>((value, ctx) => {
    const createRequiredError = () =>
      ctx.createError({
        ...REQUIRED_ERROR_INFO,
        message: message || REQUIRED_ERROR_INFO.message,
      });

    if (
      typeof value === 'number' ||
      typeof value === 'symbol' ||
      value instanceof Date
    ) {
      return undefined;
    }

    if (typeof value === 'string') {
      return value.trim() ? undefined : createRequiredError();
    }

    if (typeof value === 'boolean') {
      return value ? undefined : createRequiredError();
    }

    if (!isEmpty(value)) {
      return undefined;
    }

    return createRequiredError();
  });
