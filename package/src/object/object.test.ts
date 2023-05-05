import {
  REQUIRED_ERROR_INFO,
  ValidationErrorMap,
  createErrorCode,
  createErrorMap,
  createSimpleError,
} from '../core';
import { string } from '../string';

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

      expect(result?.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([new Date(), [1, 2], new TestClass()])(
    'Возвращает ошибку, если value не простой объект - %s',
    (value) => {
      const validate = object<{}>({});

      const result = validate(value);

      expect(result?.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
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

  it('object.define:isPartial: выключает required для всех свойств объекта', () => {
    const validate = object<{ name: string; surname: string }>({
      name: string(),
      surname: string(),
    }).define({
      isPartial: true,
    });

    const result = validate({});

    expect(result).toBeUndefined();
  });

  it('Генерирует ошибку для object', () => {
    const validate = object<{ name: string; surname: string }>({
      name: string(),
      surname: string(),
    });

    const expectError = createErrorMap({
      name: createSimpleError(REQUIRED_ERROR_INFO),
      surname: createSimpleError(REQUIRED_ERROR_INFO),
    });

    const error = validate({}) as ValidationErrorMap;

    expect(error).toEqual(expectError);
  });

  it('Поддерживает кастомные валидации для полей объекта', () => {
    const validate = object<{ name: string }>({
      name: (_, ctx) =>
        ctx.createError({
          message: 'name error',
          code: createErrorCode('error'),
        }),
    });

    const error = validate({}) as ValidationErrorMap;

    expect(error.errorMap.name?.message).toBe('name error');
  });
});
