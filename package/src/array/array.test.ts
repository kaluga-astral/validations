import {
  ValidationArrayError,
  createArrayError,
  createErrorMap,
  createSimpleError,
} from '../core';
import { object } from '../object';
import { STRING_TYPE_ERROR_INFO, string } from '../string';

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

  it('Возвращает ошибку, содержащую массив ошибок для каждого item', () => {
    const value = [
      { name: 'name', age: 22 },
      { name: 'name', age: 22 },
    ];

    const validateArray = array(
      object<{ name: string; age?: number }>({
        name: string(),
        age: string(),
      }),
    );

    const error = validateArray(value);

    const expectedError = createArrayError([
      createErrorMap({
        name: undefined,
        age: createSimpleError(STRING_TYPE_ERROR_INFO),
      }),
      createErrorMap({
        name: undefined,
        age: createSimpleError(STRING_TYPE_ERROR_INFO),
      }),
    ]);

    expect(error).toEqual(expectedError);
  });
});
