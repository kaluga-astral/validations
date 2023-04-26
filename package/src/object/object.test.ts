import { ValidationErrorMap, createErrorMap, createSimpleError } from '../core';

import { object } from './object';
import { OBJECT_TYPE_ERROR_INFO } from './constants';

class TestClass {
  value = 22;
}

describe('object', () => {
  it.each<unknown>([NaN, Symbol(), true])(
    'Возвращает ошибку типа, если value не пустое и не объект - %s',
    (value) => {
      const validate = object<{}>({});

      const result = validate(value);

      expect(result?.cause.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([new Date(), [1, 2], new TestClass()])(
    'Возвращает ошибку, если value не простой объект - %s',
    (value) => {
      const validate = object<{}>({});

      const result = validate(value);

      expect(result?.cause.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([{ value: 'value' }])(
    'Не возвращает ошибку, если value простой объект - %j',
    (value) => {
      const validate = object<{}>({});

      const result = validate(value);

      expect(result).toBeUndefined();
    },
  );

  it('object.define:typeErrorMessage: позволяет переопределить сообщение ошибки типа', () => {
    const validate = object<{}>({}).define({
      typeErrorMessage: 'custom type error',
    });

    const error = validate('string');

    expect(error?.message).toBe('custom type error');
  });

  it('Генерирует ошибку для object', () => {
    const validate = object<{ name: string; surname: string }>({
      name: (_, ctx) =>
        ctx.createError({ message: 'name error', code: Symbol() }),
      surname: (_, ctx) =>
        ctx.createError({ message: 'surname error', code: Symbol() }),
    });

    const expectError = createErrorMap({
      name: createSimpleError({ message: 'name error', code: Symbol() }),
      surname: createSimpleError({ message: 'surname error', code: Symbol() }),
    });

    const error = validate({ name: 'name' }) as ValidationErrorMap;

    expect(error).toEqual(expectError);
    expect(error?.cause.errorMap.name?.message).toBe('name error');
  });
});
