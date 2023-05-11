import { createSimpleError } from '../../SimpleError';

import { createArrayError } from './createArrayError';

describe('createArrayError', () => {
  it('Подставляет в error.message текст от первой ошибки из массива', () => {
    const errorArray = [
      undefined,
      createSimpleError({ message: 'name error', code: Symbol() }),
    ];

    const error = createArrayError(errorArray);

    expect(error.message).toBe('Ошибка в item[1]: name error');
  });

  it('В error.code попадает код из первой ошибки map', () => {
    const errorArray = [
      undefined,
      createSimpleError({ message: 'name error', code: Symbol() }),
    ];

    const error = createArrayError(errorArray);

    expect(error.cause.code).toBe(errorArray[1]?.cause.code);
  });

  it('В error.cause.errorArray записывается array из аргумента', () => {
    const errorArray = [
      undefined,
      createSimpleError({ message: 'name error', code: Symbol() }),
    ];

    const error = createArrayError(errorArray);

    expect(error.cause.errorArray).toEqual(errorArray);
  });
});
