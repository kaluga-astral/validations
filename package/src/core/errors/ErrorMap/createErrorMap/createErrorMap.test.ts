import { createSimpleError } from '../../SimpleError';

import { createErrorMap } from './createErrorMap';

describe('createErrorMap', () => {
  it('Подставляет в error.message текст от первой ошибки из map', () => {
    const errorMap = {
      name: createSimpleError({ message: 'name error', code: Symbol() }),
      surname: createSimpleError({ message: 'surname error', code: Symbol() }),
    };

    const error = createErrorMap(errorMap);

    expect(error.message).toBe('Ошибка в свойстве name: name error');
  });

  it('В error.code попадает код из первой ошибки map', () => {
    const errorMap = {
      name: createSimpleError({ message: 'name error', code: Symbol() }),
      surname: createSimpleError({ message: 'surname error', code: Symbol() }),
    };

    const error = createErrorMap(errorMap);

    expect(error.cause.code).toBe(errorMap.name.cause.code);
  });

  it('В error.cause.errorMap записывается объект из аргумента', () => {
    const errorMap = {
      name: createSimpleError({ message: 'name error', code: Symbol() }),
      surname: createSimpleError({ message: 'surname error', code: Symbol() }),
    };

    const error = createErrorMap(errorMap);

    expect(error.cause.errorMap).toEqual(errorMap);
  });
});
