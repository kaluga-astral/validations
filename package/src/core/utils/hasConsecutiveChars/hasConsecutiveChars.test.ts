import { hasConsecutiveChars } from './hasConsecutiveChars';

describe('hasConsecutiveChars', () => {
  it('Возвращает true, если содержит двойной пробел', () => {
    expect(hasConsecutiveChars('Тест  Тест')).toBeTruthy();
  });

  it('Возвращает true, если значение содержит последовательно два специальных символа', () => {
    expect(hasConsecutiveChars('Тест--Тест')).toBeTruthy();
  });
});
