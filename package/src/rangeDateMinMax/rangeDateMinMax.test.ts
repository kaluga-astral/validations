import {
  RANGE_DATE_MAX_ERROR_INFO,
  RANGE_DATE_MIN_ERROR_INFO,
} from './constants';
import { rangeDateMinMax } from './rangeDateMinMax';

describe('rangeDateMinMax', () => {
  describe('Значения валидно', () => {
    it('Если дата начала позже заданной минимальной', () => {
      const result = rangeDateMinMax({
        start: { min: { limit: new Date('2024.09.05') } },
      })({ start: new Date('2024.09.06') });

      expect(result).toBeUndefined();
    });

    it('Если дата начала раньше заданной максимальной', () => {
      const result = rangeDateMinMax({
        start: { max: { limit: new Date('2024.09.05') } },
      })({ start: new Date('2024.09.04') });

      expect(result).toBeUndefined();
    });

    it('Если дата окончания позже заданной минимальной', () => {
      const result = rangeDateMinMax({
        end: { min: { limit: new Date('2024.09.05') } },
      })({ end: new Date('2024.09.06') });

      expect(result).toBeUndefined();
    });

    it('Если дата окончания раньше заданной максимально', () => {
      const result = rangeDateMinMax({
        end: { max: { limit: new Date('2024.09.05') } },
      })({ end: new Date('2024.09.04') });

      expect(result).toBeUndefined();
    });
  });

  describe('Возвращает ошибку', () => {
    it('Если дата начала раньше заданной минимальной', () => {
      const error = rangeDateMinMax({
        start: { min: { limit: new Date('2024.09.05') } },
      })({ start: new Date('2024.09.04') });

      expect(error?.cause.code).toBe(RANGE_DATE_MIN_ERROR_INFO.code);
    });

    it('Если дата начала позже заданной максимальной', () => {
      const error = rangeDateMinMax({
        start: { max: { limit: new Date('2024.09.05') } },
      })({ start: new Date('2024.09.06') });

      expect(error?.cause.code).toBe(RANGE_DATE_MAX_ERROR_INFO.code);
    });

    it('Если дата окончания раньше заданной минимальной', () => {
      const error = rangeDateMinMax({
        end: { min: { limit: new Date('2024.09.05') } },
      })({ end: new Date('2024.09.04') });

      expect(error?.cause.code).toBe(RANGE_DATE_MIN_ERROR_INFO.code);
    });

    it('Если дата окончания позже заданной максимально', () => {
      const error = rangeDateMinMax({
        end: { max: { limit: new Date('2024.09.05') } },
      })({ end: new Date('2024.09.06') });

      expect(error?.cause.code).toBe(RANGE_DATE_MAX_ERROR_INFO.code);
    });
  });

  describe('Дефолтный message переопределяется через параметры', () => {
    it('Для даты начала с заданым минимальным значением', () => {
      const customMessage = 'CustomMessage';

      const error = rangeDateMinMax({
        start: {
          min: { limit: new Date('2024.09.05'), message: () => customMessage },
        },
      })({ start: new Date('2024.09.04') });

      expect(error?.message).toBe(customMessage);
    });

    it('Для даты начала с заданым максимальным значением', () => {
      const customMessage = 'CustomMessage';

      const error = rangeDateMinMax({
        start: {
          max: { limit: new Date('2024.09.05'), message: () => customMessage },
        },
      })({ start: new Date('2024.09.06') });

      expect(error?.message).toBe(customMessage);
    });

    it('Для даты окончания с заданым минимальным значением', () => {
      const customMessage = 'CustomMessage';

      const error = rangeDateMinMax({
        end: {
          min: { limit: new Date('2024.09.05'), message: () => customMessage },
        },
      })({ end: new Date('2024.09.04') });

      expect(error?.message).toBe(customMessage);
    });

    it('Для даты окончания с заданым максимальным значением', () => {
      const customMessage = 'CustomMessage';

      const error = rangeDateMinMax({
        end: {
          max: { limit: new Date('2024.09.05'), message: () => customMessage },
        },
      })({ end: new Date('2024.09.06') });

      expect(error?.message).toBe(customMessage);
    });
  });
});
