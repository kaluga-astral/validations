import { RANGE_DATE_INTERVAL_ERROR_INFO } from './constants';
import { rangeDateInterval } from './rangeDateInterval';

describe('rangeDateInterval', () => {
  describe('Значения валидно, если интервал не превышает заданный', () => {
    it('Для единиц, заданных в днях', () => {
      const result = rangeDateInterval({ limit: 7, unit: 'day' })({
        start: new Date('2024.09.01'),
        end: new Date('2024.09.05'),
      });

      expect(result).toBeUndefined();
    });

    it('Для единиц, заданных в месяцах', () => {
      const result = rangeDateInterval({ limit: 7, unit: 'month' })({
        start: new Date('2024.01.01'),
        end: new Date('2024.05.01'),
      });

      expect(result).toBeUndefined();
    });

    it('Для единиц, заданных в годах', () => {
      const result = rangeDateInterval({ limit: 2, unit: 'year' })({
        start: new Date('2024.01.01'),
        end: new Date('2024.09.05'),
      });

      expect(result).toBeUndefined();
    });
  });

  describe('Возвращает ошибку, если дата окончания выходит за интервал', () => {
    it('Для единиц, заданных в днях', () => {
      const error = rangeDateInterval({ limit: 7, unit: 'day' })({
        start: new Date('2024.09.01'),
        end: new Date('2024.09.11'),
      });

      expect(error?.cause.code).toBe(RANGE_DATE_INTERVAL_ERROR_INFO.code);
    });

    it('Для единиц, заданных в месяцах', () => {
      const error = rangeDateInterval({ limit: 7, unit: 'month' })({
        start: new Date('2024.01.01'),
        end: new Date('2024.09.01'),
      });

      expect(error?.cause.code).toBe(RANGE_DATE_INTERVAL_ERROR_INFO.code);
    });

    it('Для единиц, заданных в годах', () => {
      const error = rangeDateInterval({ limit: 2, unit: 'year' })({
        start: new Date('2020.09.01'),
        end: new Date('2024.09.01'),
      });

      expect(error?.cause.code).toBe(RANGE_DATE_INTERVAL_ERROR_INFO.code);
    });
  });

  it('Дефолтный message переопределяется через параметр', () => {
    const customMessage = 'CustomMessage';

    const error = rangeDateInterval({ limit: 7, message: customMessage })({
      start: new Date('2024.09.01'),
      end: new Date('2024.09.11'),
    });

    expect(error?.message).toBe(customMessage);
  });
});
