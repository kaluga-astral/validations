import { ValidationArrayError, createSimpleError } from '../core';

import { array } from './array';
import { ARRAY_TYPE_ERROR_INFO } from './constants';

describe('array', () => {
  it.each<unknown>([22, 'string', Symbol(), { value: 22 }, new Set([1])])(
    'Ошибка, если не массив: %s',
    (value) => {
      const error = array()(value);

      expect(error?.cause.code).toBe(ARRAY_TYPE_ERROR_INFO.code);
    },
  );

  it('Возвращает массив ошибок', () => {
    const errorCode = Symbol();

    const error = array((value, ctx) =>
      ctx.createError({ message: String(value), code: errorCode }),
    )([1, 2, 3]);

    const expectedErrors = [
      createSimpleError({ message: '1', code: errorCode }),
      createSimpleError({ message: '2', code: errorCode }),
      createSimpleError({ message: '3', code: errorCode }),
    ];

    expect((error as ValidationArrayError).cause.errorArray).toEqual(
      expectedErrors,
    );
  });

  it('Каждый элемент массива ошибок соответствует результату выполнения правила валидации для item', () => {
    const errorCode = Symbol();

    const error = array((value, ctx) => {
      if (typeof value === 'number') {
        return ctx.createError({ message: String(value), code: errorCode });
      }

      return undefined;
    })([1, 'string', 3]);

    const expectedErrors = [
      createSimpleError({ message: '1', code: errorCode }),
      undefined,
      createSimpleError({ message: '3', code: errorCode }),
    ];

    expect((error as ValidationArrayError).cause.errorArray).toEqual(
      expectedErrors,
    );
  });
});
