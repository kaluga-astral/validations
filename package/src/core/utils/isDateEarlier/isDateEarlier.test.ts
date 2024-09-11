import { isDateEarlier } from './isDateEarlier';

describe('isDateEarlier', () => {
  it('Возвращает "true", если первая дата раньше второй', () => {
    expect(
      isDateEarlier(new Date('2024.09.01'), new Date('2024.09.05')),
    ).toBeTruthy();
  });

  it('Возвращает "false", если первая дата позже второй', () => {
    expect(
      isDateEarlier(new Date('2024.09.05'), new Date('2024.09.01')),
    ).toBeFalsy();
  });

  it('Возвращает "false", если даты равны', () => {
    expect(
      isDateEarlier(new Date('2024.09.05'), new Date('2024.09.05')),
    ).toBeFalsy();
  });
});
