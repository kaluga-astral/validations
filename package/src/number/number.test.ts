import { ValidationSimpleError, createErrorCode } from '../core';
import { min } from '../min';

import { INFINITY_NUMBER_ERROR_INFO, NAN_NUMBER_ERROR_INFO } from './constants';
import { number } from './number';

describe('number', () => {
  it.each<unknown>(['string', new Date(), {}, Symbol()])(
    'Возвращает ошибку для "%s"',
    (value) => {
      const error = number()(value);

      expect(error instanceof ValidationSimpleError).toBeTruthy();
    },
  );

  it.each<unknown>([0, -2])('Не возвращает ошибку для "%s"', (value) => {
    const result = number()(value);

    expect(result).toBeUndefined();
  });

  it('Возвращает отдельную ошибку для NaN', () => {
    const error = number()(NaN);

    expect(error?.cause.code).toBe(NAN_NUMBER_ERROR_INFO.code);
  });

  it('Возвращает отдельную ошибку для Infinity', () => {
    const error = number()(Infinity);

    expect(error?.cause.code).toBe(INFINITY_NUMBER_ERROR_INFO.code);
  });

  it('Выполняет композицию для переданных rules', () => {
    const validate = number(min(0), (_, ctx) =>
      ctx.createError({
        message: 'custom error',
        code: createErrorCode('error'),
      }),
    );
    const error = validate(22);

    expect(error?.message).toBe('custom error');
  });
});
