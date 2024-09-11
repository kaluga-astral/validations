import { RANGE_DATE_NOT_EQUAL_ERROR_INFO } from './constants';
import { rangeDateNotEqual } from './rangeDateNotEqual';

describe('rangeDateNotEqual', () => {
  it('Значения валидно, если даты не равны', () => {
    expect(
      rangeDateNotEqual()({
        start: new Date('2024.09.05'),
        end: new Date('2024.09.06'),
      }),
    ).toBeUndefined();
  });

  it('Возвращает ошибку, если даты равны', () => {
    const error = rangeDateNotEqual()({ start: new Date(), end: new Date() });

    expect(error?.cause.code).toBe(RANGE_DATE_NOT_EQUAL_ERROR_INFO.code);
  });

  it('Дефолтный message переопределяется через параметры', () => {
    const customMessage = 'CustomMessage';

    const error = rangeDateNotEqual({ message: customMessage })({
      start: new Date(),
      end: new Date(),
    });

    expect(error?.message).toBe(customMessage);
  });
});
