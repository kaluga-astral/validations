import { hasConsecutiveChars } from './hasConsecutiveChars';

describe('hasConsecutiveChars', () => {
  it.each([
    ['Тест  Тест', true],
    ['Тест--Тест', true],
  ])('Возвращает "%s" со значением %s', (value, expected) => {
    expect(hasConsecutiveChars(value)).toBe(expected);
  });
});
