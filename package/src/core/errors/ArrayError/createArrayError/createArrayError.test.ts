import { createSimpleError } from '../../SimpleError';
import { createErrorCode } from '../../createErrorCode';

import { createArrayError } from './createArrayError';

describe('createArrayError', () => {
  it('Подставляет в error.message текст от первой ошибки из массива', () => {
    const errorArray = [
      undefined,
      createSimpleError({
        message: 'name error',
        code: createErrorCode('name'),
      }),
    ];

    const error = createArrayError(errorArray);

    expect(error.message).toBe('Ошибка в item[1]: name error');
  });

  it('В error.code попадает код из первой ошибки map', () => {
    const errorArray = [
      undefined,
      createSimpleError({
        message: 'name error',
        code: createErrorCode('name'),
      }),
    ];

    const error = createArrayError(errorArray);

    expect(error.code).toBe(errorArray[1]?.code);
  });

  it('В error.errorArray записывается array из аргумента', () => {
    const errorArray = [
      undefined,
      createSimpleError({
        message: 'name error',
        code: createErrorCode('name'),
      }),
    ];

    const error = createArrayError(errorArray);

    expect(error.errorArray).toEqual(errorArray);
  });
});
