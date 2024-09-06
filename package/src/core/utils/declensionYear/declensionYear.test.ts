import { declensionYear } from './declensionYear';

describe('declensionYear', () => {
  it.each([1, 21, 31])('Возвращает "год", если value равно "%s"', (value) => {
    expect(declensionYear(value)).toBe('год');
  });

  it.each([2, 3, 4, 22, 23])(
    'Возвращает "года", если value равно "%s"',
    (value) => {
      expect(declensionYear(value)).toBe('года');
    },
  );

  it.each([5, 6, 7, 10, 15])(
    'Возвращает "лет", если value равно "%s"',
    (value) => {
      expect(declensionYear(value)).toBe('лет');
    },
  );
});
