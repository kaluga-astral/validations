import {
  ValidationArrayError,
  createErrorCode,
  createSimpleError,
} from '../core';
import { array } from '../array';

import { arrayItem } from './arrayItem';

describe('arrayItem', () => {
  it('Соотносит элемент массива и результат его валидации', () => {
    const errorCode = createErrorCode('error');

    const validateArray = array(
      arrayItem<string | number>((value, ctx) => {
        if (typeof value === 'number') {
          return ctx.createError({ message: 'number error', code: errorCode });
        }

        return undefined;
      }),
    );

    const error = validateArray([1, 'string', 3]);

    const expectedErrors = [
      createSimpleError({ message: 'number error', code: errorCode }),
      undefined,
      createSimpleError({ message: 'number error', code: errorCode }),
    ];

    expect((error as ValidationArrayError).cause.errorArray).toEqual(
      expectedErrors,
    );
  });

  it('Не возвращает ошибку, если все item валидные', () => {
    const validateArray = array(arrayItem(() => undefined));

    const result = validateArray([1, 'string', 3]);

    expect(result).toBeUndefined();
  });
});
