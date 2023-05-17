import { expect } from 'vitest';

import { onlyNumber } from './onlyNumber';
import { ONLY_NUMBER_ERROR_CODE } from './constants';

describe('onlyNumber', () => {
  it.each<string>(['123', '0000000', '1', '0', '91999099'])(
    'value:%s: valid',
    (value) => {
      const validate = onlyNumber();

      const result = validate(value);

      expect(result).toBeUndefined();
    },
  );

  it.each<string>([
    '-a123',
    'a123',
    'aaa',
    '1a11aa',
    '1.23bb',
    '-a',
    '+a',
    '43.443.43',
    '43..32',
    '43..',
    '.43',
    '1,2',
    '10-122',
    '2+2',
    '12`/?*',
  ])('value:%s: invalid', (value) => {
    const validate = onlyNumber();

    const error = validate(value);

    expect(error?.cause.code).toEqual(ONLY_NUMBER_ERROR_CODE);
  });

  it('params.message: позволяет переопределить message', () => {
    const validate = onlyNumber({ message: 'my message' });

    const error = validate('123aa');

    expect(error?.message).toBe('my message');
  });
});
