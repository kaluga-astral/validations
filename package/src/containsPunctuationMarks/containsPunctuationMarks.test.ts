import { expect } from 'vitest';

import { containsPunctuationMarks } from './containsPunctuationMarks';
import { CONTAINS_PUNCTUATION_MARKS_ERROR_CODE } from './constants';

describe('containsPunctuationMarks', () => {
  it.each<string>([
    'f!',
    'f$',
    'f%',
    'f&',
    'f’',
    'f”',
    "f'",
    'f"',
    'f(',
    'f)',
    'f+',
    'f,',
    'f-',
    'f.',
    'f/',
    'f:',
    'f;',
    'f<',
    'f=',
    'f>',
    'f?',
    'f@',
    'f[',
    'f]',
    'f^',
    'f_',
    'f{',
    'f|',
    'f}',
  ])('Value "%s" валидно', (value) => {
    const validate = containsPunctuationMarks();

    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each<string>(['fff', 'FFF'])('Value "%s" невалидно', (value) => {
    const validate = containsPunctuationMarks();

    const error = validate(value);

    expect(error?.cause.code).toEqual(CONTAINS_PUNCTUATION_MARKS_ERROR_CODE);
  });

  it('Дефолтный message переопределяется через параметры', () => {
    const validate = containsPunctuationMarks({ message: 'my message' });

    const error = validate('aa');

    expect(error?.message).toBe('my message');
  });
});
