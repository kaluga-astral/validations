import { createRule } from '../core';

import { STRING_LENGTH_ERROR_CODE } from './constants';

type LengthParams = {
  /**
   * Замена стандартного сообщения ошибки.
   */
  message?: string;
};

/**
 * Проверяет значение на соответствие длине. Работает с: string
 * @param len - целевой кол-во символов
 * @example
 *  // Длина строки должна быть 5 символов
 *  const validate = string(length(5));
 *
 *  // undefined
 *  validate('aaaaa')
 *
 *  // error
 *  validate('va')
 *
 */
export const length = <TLastSchemaValues extends Record<string, unknown>>(
  len: number,
  params?: LengthParams,
) =>
  createRule<string, TLastSchemaValues>((value, ctx) => {
    const currentLength = value.trim().length;

    if (currentLength !== len) {
      return ctx.createError({
        code: STRING_LENGTH_ERROR_CODE,
        message: params?.message || `Кол-во символов должно быть: ${len}`,
      });
    }

    return undefined;
  });
