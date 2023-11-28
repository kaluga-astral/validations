import { expect } from 'vitest';

import { containsDifferentCases } from './containsDifferentCases';
import { CONTAINS_DIFFERENT_CASES_ERROR_CODE } from './constants';

describe('containsDifferentCases', () => {
  it.each<string>([
    'fffFFF',
    'фффФФФ',
    'фффFFF',
    'fffФФФ',
    'f78Ф',
    'ёЁ',
    'ё123Ё',
  ])('Значение "%s" валидно', (value) => {
    const validate = containsDifferentCases();

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<string>(['fff', 'FFF', 'ффф', 'ФФФ', '123', 'ёёё', 'ЁЁЁ'])(
    'Значение "%s" не валидно',
    (value) => {
      const validate = containsDifferentCases();

      const error = validate(value);

      expect(error?.cause.code).toEqual(CONTAINS_DIFFERENT_CASES_ERROR_CODE);
    },
  );

  it('Позволяет переопределить дефолтный message ошибки', () => {
    const validate = containsDifferentCases({ message: 'my message' });

    const error = validate('aa');

    expect(error?.message).toBe('my message');
  });
});
