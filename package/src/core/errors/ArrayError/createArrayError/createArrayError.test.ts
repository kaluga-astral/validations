import { createSimpleError } from '../../SimpleError';
import { createErrorCode } from '../../createErrorCode';

import { createArrayError } from './createArrayError';

describe('createArrayError', () => {
  it('Подставляет в error.message текст от первой ошибки из массива', () => {
    const errorArray = [
      undefined,
      createSimpleError({
        message: 'name error',
        code: createErrorCode('error'),
      }),
    ];

    const error = createArrayError(errorArray);

    expect(error.message).toBe('Ошибка в item[1]: name error');
  });

  it('Подставляет в error.code код из первой ошибки map', () => {
    const errorArray = [
      undefined,
      createSimpleError({
        message: 'name error',
        code: createErrorCode('error'),
      }),
    ];

    const error = createArrayError(errorArray);

    expect(error.cause.code).toBe(errorArray[1]?.cause.code);
  });

  it('Записывает array из аргумента в error.cause.errorArray', () => {
    const errorArray = [
      undefined,
      createSimpleError({
        message: 'name error',
        code: createErrorCode('error'),
      }),
    ];

    const error = createArrayError(errorArray);

    expect(error.cause.errorArray).toEqual(errorArray);
  });
});
