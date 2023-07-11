import { isNoDoubleZeroStart } from './isNoDoubleZeroStart';

describe('isNoDoubleZeroStart', () => {
  it('Возвращает true для строк не содержащих "0"', () => {
    expect(isNoDoubleZeroStart('384212952720')).toBe(true);
  });

  it('Возвращает true для строк содержащих "0" в начале', () => {
    expect(isNoDoubleZeroStart('0728168971')).toBe(true);
  });

  it('Возвращает false для строк содержащих "00" в начале', () => {
    expect(isNoDoubleZeroStart('00528168971')).toBe(false);
  });
});
