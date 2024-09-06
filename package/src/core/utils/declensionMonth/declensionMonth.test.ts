import { declensionMonth } from './declensionMonth';

describe('declensionMonth', () => {
  it.each([1, 21, 31])('Возвращает "месяц", если value равно "%s"', (value) => {
    expect(declensionMonth(value)).toBe('месяц');
  });

  it.each([2, 3, 4, 22, 23])(
    'Возвращает "месяца", если value равно "%s"',
    (value) => {
      expect(declensionMonth(value)).toBe('месяца');
    },
  );

  it.each([5, 6, 7, 10, 15])(
    'Возвращает "месяцев", если value равно "%s"',
    (value) => {
      expect(declensionMonth(value)).toBe('месяцев');
    },
  );
});
