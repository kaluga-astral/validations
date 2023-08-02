import { isStartsWithAndEndsWithLetter } from './isStartsWithAndEndsWithLetter';

describe('isStartsWithAndEndsWithLetter', () => {
  it.each([
    ['123Тест', true],
    ['Тест123', true],

    ['Тест', false],
    ['(Тест)', false],
    ['(Тест', false],
    ['Тест)', false],
  ])('Возвращает "%s" со значением %s', (value, expected) => {
    expect(isStartsWithAndEndsWithLetter(value)).toBe(expected);
  });
});
