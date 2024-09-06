import { declensionDay } from './declensionDay';

describe('declensionDay', () => {
  it.each([1, 21, 31])('Возвращает "день", если value равно "%s"', (value) => {
    expect(declensionDay(value)).toBe('день');
  });

  it.each([2, 3, 4, 22, 23])(
    'Возвращает "дня", если value равно "%s"',
    (value) => {
      expect(declensionDay(value)).toBe('дня');
    },
  );

  it.each([5, 6, 7, 10, 15])(
    'Возвращает "дней", если value равно "%s"',
    (value) => {
      expect(declensionDay(value)).toBe('дней');
    },
  );
});
