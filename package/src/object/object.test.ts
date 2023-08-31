import {
  REQUIRED_ERROR_INFO,
  ValidationErrorMap,
  createErrorCode,
  createErrorMap,
  createSimpleError,
} from '../core';
import { string } from '../string';
import { optional } from '../optional';
import { array } from '../array';
import { arrayItem } from '../arrayItem';

import { object } from './object';
import { OBJECT_TYPE_ERROR_INFO } from './constants';

class TestClass {
  value = 22;
}

describe('object', () => {
  it.each<unknown>([NaN, createErrorCode('error'), true])(
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
      surname: optional(string()),
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

    expect(error.cause.errorMap.name?.message).toBe('name error');
  });

  it('Позволяет получить доступ к последнему объекту из схемы', () => {
    type Field = { type: string; param1: string };

    const validate = object<{
      fields: Field[];
    }>({
      fields: array(
        arrayItem(
          object<Field>({
            type: string(),
            param1: (_, ctx) => {
              if (ctx.values?.type === 'type1') {
                return ctx.createError({ message: 'error', code: 'code' });
              }

              return undefined;
            },
          }),
        ),
      ),
    });

    const error = validate({
      fields: [{ type: 'type1', param1: undefined }],
    });

    expect(error?.cause.code).toBe('code');
  });

  it('Позволяет из кастомного правила возвращать guard', () => {
    const validate = object<{ name: string }>({
      name: () => string(),
    });

    const error = validate({}) as ValidationErrorMap;

    expect(error.cause.errorMap.name?.message).toBe('Обязательно');
  });
});
