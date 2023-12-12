import {
  REQUIRED_ERROR_INFO,
  type ValidationErrorMap,
  createErrorCode,
  createErrorMap,
  createSimpleError,
} from '../../core';
import { string, stringAsync } from '../../string';
import { optional } from '../../optional';
import { OBJECT_TYPE_ERROR_INFO } from '../constants';

import { objectAsync } from './objectAsync';

class TestClass {
  value = 22;
}

describe('objectAsync', () => {
  it.each<unknown>([NaN, createErrorCode('error'), true])(
    'Возвращает ошибку типа, если value не пустое и не объект - %s',
    async (value) => {
      const validate = objectAsync<{}>({});

      const result = await validate(value);

      expect(result?.cause.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([new Date(), [1, 2], new TestClass()])(
    'Возвращает ошибку, если value не простой объект - %s',
    async (value) => {
      const validate = objectAsync<{}>({});

      const result = await validate(value);

      expect(result?.cause.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([{ value: 'value' }])(
    'Не возвращает ошибку, если value простой объект - %j',
    async (value) => {
      const validate = objectAsync<{}>({});

      const result = await validate(value);

      expect(result).toBeUndefined();
    },
  );

  it('object.define:typeErrorMessage: позволяет переопределить сообщение ошибки типа', async () => {
    const validate = objectAsync<{}>({}).define({
      typeErrorMessage: 'custom type error',
    });

    const error = await validate('string');

    expect(error?.message).toBe('custom type error');
  });

  it('object.define:isPartial: выключает required для всех свойств объекта', async () => {
    const validate = objectAsync<{ name: string; surname: string }>({
      name: string(),
      surname: string(),
    }).define({
      isPartial: true,
    });

    const result = await validate({});

    expect(result).toBeUndefined();
  });

  it('Генерирует ошибку для object', async () => {
    const validate = objectAsync<{ name: string; surname: string }>({
      name: string(),
      surname: optional(string()),
    });

    const expectError = createErrorMap({
      name: createSimpleError(REQUIRED_ERROR_INFO),
      surname: createSimpleError(REQUIRED_ERROR_INFO),
    });

    const error = await validate({});

    expect(error).toEqual(expectError);
  });

  it('Поддерживает кастомные валидации для полей объекта', async () => {
    const validate = objectAsync<{ name: string }>({
      name: (_, ctx) =>
        ctx.createError({
          message: 'name error',
          code: createErrorCode('error'),
        }),
    });

    const error = (await validate({})) as ValidationErrorMap;

    expect(error?.cause.errorMap.name?.message).toBe('name error');
  });

  it('Позволяет из кастомного правила возвращать guard', async () => {
    const validate = objectAsync<{ name: string }>({
      name: () => string(),
    });

    const error = (await validate({})) as ValidationErrorMap;

    expect(error.cause.errorMap.name?.message).toBe('Обязательно');
  });

  it('Позволяет использовать асинхронные guard и правила в схеме', async () => {
    const validate = objectAsync<{ name: string }>({
      name: stringAsync(async (_, ctx) =>
        ctx.createError({ code: 'code', message: 'error1' }),
      ),
    });

    const error = (await validate({ name: 'name' })) as ValidationErrorMap;

    expect(error.cause.errorMap.name?.message).toBe('error1');
  });
});
