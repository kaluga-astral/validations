import { isCheckValidCharacters } from './isCheckValidCharacters';

describe('isCheckValidCharacters', () => {
  it.each([
    ['123', true],
    ['@#$%', true],
    ['i', true],
    ['v', true],
  ])('Возвращает "%s" со значением %s', (value, expected) => {
    expect(isCheckValidCharacters(value)).toBe(expected);
  });

  it.each([
    ['V', false],
    ['тест', false],
    ['Тест Тест', false],
    ['Тест-Тест', false],
    ['Тест,Тест', false],
    ['Тест.Тест', false],
    ['Тест’‎Тест', false],
    ['(Тест)', false],
    ['(Тёст)', false],
  ])('Возвращает "%s" со значением %s', (value, expected) => {
    expect(isCheckValidCharacters(value)).toBe(expected);
  });
});
