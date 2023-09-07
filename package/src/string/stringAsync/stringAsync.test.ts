import { createErrorCode } from '../../core';
import { STRING_TYPE_ERROR_INFO } from '../constants';

import { stringAsync } from './stringAsync';

describe('stringAsync', () => {
  it.each<unknown>([Symbol(), {}, [], 12, new Date()])(
    'Возвращает ошибку типа, если value не строка - %j',
    async (value) => {
      const validate = stringAsync();

      const result = await validate(value);

      expect(result?.cause.code).toBe(STRING_TYPE_ERROR_INFO.code);
    },
  );

  it('Не возвращает ошибку типа, если value строка', async () => {
    const validate = stringAsync();

    const result = await validate('string');

    expect(result).toBeUndefined();
  });

  it('Вызывает переданные rules', async () => {
    const validate = stringAsync(
      () => undefined,
      (_, ctx) =>
        ctx.createError({
          message: 'stringerror',
          code: createErrorCode('error'),
        }),
    );

    const result = await validate('string');

    expect(result?.message).toBe('stringerror');
  });

  it('Позволяет использовать асинхронные правила', async () => {
    const validate = stringAsync(
      () => undefined,
      async (_, ctx) =>
        ctx.createError({
          message: 'stringerror',
          code: createErrorCode('error'),
        }),
    );

    const result = await validate('string');

    expect(result?.message).toBe('stringerror');
  });
});
