import { isStringOfZeros } from './isStringOfZeros';

describe('isStringOfZeros', () => {
  it('Возвращает true для строк содержащих только "0"', () => {
    expect(isStringOfZeros('00000')).toBe(true);
  });

  it('Возвращает false для строк содержащих "0" и другие значения', () => {
    expect(isStringOfZeros('010101')).toBe(false);
  });

  it('Возвращает false для строк не содержащих "0"', () => {
    expect(isStringOfZeros('123456789')).toBe(false);
  });
});
