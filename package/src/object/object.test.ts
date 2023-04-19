import { expect } from 'vitest';

import { OBJECT_TYPE_ERROR_INFO } from '../core';

import { object } from './object';

class TestClass {}

describe('object', () => {
  it.each<unknown>([null, undefined, NaN, Symbol(), () => {}, true, false])(
    'Возвращает ошибку, если value не объект - %s',
    (value) => {
      const validate = object<{}>({});

      const result = validate(value);

      expect(result?.cause.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([new Date(), new TestClass(), Object.create({}), []])(
    'Возвращает ошибку, если value не простой объект - %j',
    (value) => {
      const validate = object<{}>({});

      const result = validate(value);

      expect(result?.cause.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
    },
  );

  it.each<unknown>([{}, { value: 'value' }, Object.create(null)])(
    'Не возвращает ошибку, если value простой объект - %j',
    (value) => {
      const validate = object<{}>({});

      const result = validate(value);

      expect(result).toBeUndefined();
    },
  );
});
