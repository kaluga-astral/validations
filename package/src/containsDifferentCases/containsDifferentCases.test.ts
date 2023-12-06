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
  ])('Не Value "%s" невалидно', (value) => {
    const validate = containsDifferentCases();

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<string>(['fff', 'FFF', 'ффф', 'ФФФ', '123', 'ёёё', 'ЁЁЁ'])(
    'Value "%s" невалидно',
    (value) => {
      const validate = containsDifferentCases();

      const error = validate(value);

      expect(error?.cause.code).toEqual(CONTAINS_DIFFERENT_CASES_ERROR_CODE);
    },
  );

  it('Дефолтный message переопределяется через параметры', () => {
    const validate = containsDifferentCases({ message: 'my message' });

    const error = validate('aa');

    expect(error?.message).toBe('my message');
  });
});
