import { createSimpleError } from '../../SimpleError';
import { createErrorCode } from '../../createErrorCode';

import { createErrorMap } from './createErrorMap';

describe('createErrorMap', () => {
  it('Подставляет в error.message текст от первой ошибки из map', () => {
    const errorMap = {
      age: undefined,
      name: createSimpleError({
        message: 'name error',
        code: createErrorCode('name'),
      }),
      surname: createSimpleError({
        message: 'surname error',
        code: createErrorCode('surname'),
      }),
    };

    const error = createErrorMap(errorMap);

    expect(error.message).toBe('Ошибка в свойстве name: name error');
  });

  it('В error.code попадает код из первой ошибки map', () => {
    const errorMap = {
      name: createSimpleError({
        message: 'name error',
        code: createErrorCode('name'),
      }),
      surname: createSimpleError({
        message: 'surname error',
        code: createErrorCode('surname'),
      }),
    };

    const error = createErrorMap(errorMap);

    expect(error.code).toBe(errorMap.name.code);
  });

  it('В error.errorMap записывается объект из аргумента', () => {
    const errorMap = {
      name: createSimpleError({
        message: 'name error',
        code: createErrorCode('name'),
      }),
      surname: createSimpleError({
        message: 'surname error',
        code: createErrorCode('surname'),
      }),
    };

    const error = createErrorMap(errorMap);

    expect(error.errorMap).toEqual(errorMap);
  });
});
