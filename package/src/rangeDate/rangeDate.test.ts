import {
  RANGE_DATE_END_EARLIER_START_ERROR_INFO,
  RANGE_DATE_END_INVALID_ERROR_INFO,
  RANGE_DATE_END_REQUIRED_ERROR_INFO,
  RANGE_DATE_REQUIRED_ERROR_INFO,
  RANGE_DATE_START_INVALID_ERROR_INFO,
  RANGE_DATE_START_REQUIRED_ERROR_INFO,
} from './constants';
import { rangeDate } from './rangeDate';

describe('rangeDate', () => {
  describe('Значения валидно', () => {
    it('Если обе даты не указаны', () => {
      const result = rangeDate()({
        start: new Date('2024.09.05'),
        end: new Date('2024.09.05'),
      });

      expect(result).toBeUndefined();
    });

    it('Если дата начала не указана и задана как необязательная', () => {
      const result = rangeDate().define({ required: { start: false } })({
        end: new Date('2024.09.05'),
      });

      expect(result).toBeUndefined();
    });

    it('Если дата окончания не указана и задана как необязательная', () => {
      const result = rangeDate().define({ required: { end: false } })({
        start: new Date('2024.09.05'),
      });

      expect(result).toBeUndefined();
    });

    it('Если дата не указаны и заданы как необязательные', () => {
      const result = rangeDate().define({
        required: { start: false, end: false },
      })({});

      expect(result).toBeUndefined();
    });

    it('Если дата окончания позже даты начала', () => {
      const result = rangeDate()({
        start: new Date('2024.09.05'),
        end: new Date('2024.09.06'),
      });

      expect(result).toBeUndefined();
    });
  });

  describe('Возвращает ошибку', () => {
    it('Если обе даты не указаны', () => {
      const error = rangeDate()({});

      expect(error?.cause.code).toBe(RANGE_DATE_REQUIRED_ERROR_INFO.code);
    });

    it('Если дата начала не указана', () => {
      const error = rangeDate()({ end: new Date() });

      expect(error?.cause.code).toBe(RANGE_DATE_START_REQUIRED_ERROR_INFO.code);
    });

    it('Если дата окончания не указана', () => {
      const error = rangeDate()({ start: new Date() });

      expect(error?.cause.code).toBe(RANGE_DATE_END_REQUIRED_ERROR_INFO.code);
    });

    it('Если дата начала не валидна', () => {
      const error = rangeDate()({
        start: new Date('2024.99.99'),
        end: new Date('2024.09.05'),
      });

      expect(error?.cause.code).toBe(RANGE_DATE_START_INVALID_ERROR_INFO.code);
    });

    it('Если дата окончания не валидна', () => {
      const error = rangeDate()({
        start: new Date('2024.09.05'),
        end: new Date('2024.99.99'),
      });

      expect(error?.cause.code).toBe(RANGE_DATE_END_INVALID_ERROR_INFO.code);
    });

    it('Если дата окончания раньше даты начала', () => {
      const error = rangeDate()({
        start: new Date('2024.09.05'),
        end: new Date('2024.09.04'),
      });

      expect(error?.cause.code).toBe(
        RANGE_DATE_END_EARLIER_START_ERROR_INFO.code,
      );
    });
  });

  describe('Дефолтный message переопределяется через параметры', () => {
    it('Для даты начала', () => {
      const customMessage = 'CustomMessage';

      const error = rangeDate().define({
        messages: { startRequired: customMessage },
      })({
        end: new Date('2024.09.04'),
      });

      expect(error?.message).toBe(customMessage);
    });

    it('Для даты окончания', () => {
      const customMessage = 'CustomMessage';

      const error = rangeDate().define({
        messages: { endRequired: customMessage },
      })({
        start: new Date('2024.09.05'),
      });

      expect(error?.message).toBe(customMessage);
    });

    it('Если дата окончания раньше даты начала', () => {
      const customMessage = 'CustomMessage';

      const error = rangeDate().define({
        messages: { endEarlierStart: customMessage },
      })({ start: new Date('2024.09.05'), end: new Date('2024.09.04') });

      expect(error?.message).toBe(customMessage);
    });
  });
});
