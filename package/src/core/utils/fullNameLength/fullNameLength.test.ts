import { fullNameLength } from './fullNameLength';

describe('fullNameLength', () => {
  it.each([
    ['a', false],
    ['а'.repeat(200), false],

    ['', true],
    ['а'.repeat(201), true],
  ])('Возвращает "%s" со значением %s', (value, expected) => {
    expect(fullNameLength(value)).toBe(expected);
  });
});
