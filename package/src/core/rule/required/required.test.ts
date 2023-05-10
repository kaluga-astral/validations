import { required } from './required';
import { REQUIRED_ERROR_INFO } from './constants';

describe('required', () => {
  it.each<unknown>([
    'a',
    0,
    1,
    true,
    ['v'],
    { a: 1 },
    [undefined],
    [null],
    NaN,
    new Date(),
    Symbol(),
    new Set([22]),
    [],
    {},
    new Set([]),
    Object.create({}),
    Object.create(null),
  ])('Valid for: %s', (value) => {
    expect(required()(value)).toBe(undefined);
  });

  it.each<unknown>(['', '     ', false, null, undefined])(
    'Invalid for: %j',
    (value) => {
      const error = required()(value);

      expect(error?.code).toBe(REQUIRED_ERROR_INFO.code);
    },
  );

  it('params.message: подставляется кастомное сообщение об ошибке', () => {
    const error = required({ message: 'custom message' })(undefined);

    expect(error?.message).toBe('custom message');
  });
});
