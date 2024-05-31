import { describe, expect, it } from 'vitest';

import {
  DOUBLE_DOTS_EMAIL_ERROR_INFO,
  INVALID_EMAIL_ERROR_INFO,
  LENGTH_EMAIL_ERROR_INFO,
} from './constants';
import { email } from './email';

describe('email', () => {
  it.each<string>(['a', '@mail.ru', 'mail.ru', 'test@.ru', 'test.ru@'])(
    'Value "%s" невалидно',
    (value) => {
      const validate = email();
      const error = validate(value);

      expect(error?.cause.code).toEqual(INVALID_EMAIL_ERROR_INFO.code);
    },
  );

  it.each<string>([
    'test@test.ru',
    'test@test.com',
    'test-t@test.ru',
    'test.t@test.ru',
    'test_t@test.ru',
  ])('Value "%s" валидно', (value) => {
    const validate = email();
    const result = validate(value);

    expect(result).toBeUndefined();
  });

  describe('Username', () => {
    it('Валиден, если длина равна 1', () => {
      const validate = email();
      const result = validate('f@email.com');

      expect(result).toBeUndefined();
    });

    it('Невалиден, если длина равна 0', () => {
      const validate = email();
      const error = validate('@email.com');

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если начинается с точки', () => {
      const validate = email();
      const error = validate('.sdsf@email.com');

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если начинается с дефиса', () => {
      const validate = email();
      const error = validate('-sdsf@email.com');

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если оканчивается точкой', () => {
      const validate = email();
      const error = validate('sdsf.@email.com');

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если есть две точки подряд', () => {
      const validate = email();
      const error = validate('sd..sf@email.com');

      expect(error?.message).toBe(DOUBLE_DOTS_EMAIL_ERROR_INFO.message);
    });
  });

  describe('Hostname', () => {
    it('Невалиден, если есть две точки подряд', () => {
      const validate = email();
      const error = validate('sdsf@email..com');

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it.each(['l.com', 'sds.c'])(
      'Невалиден, если доменная зона "%s" имеет менее двух символов',
      (value) => {
        const validate = email();
        const error = validate(`email@${value}`);

        expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
      },
    );

    it('Валиден, если доменная зона состоит из двух символов', () => {
      const validate = email();
      const result = validate('email@ld.lo');

      expect(result).toBeUndefined();
    });

    it('Невалиден, если начинается с дефиса', () => {
      const validate = email();
      const error = validate('email@-ld.lo');

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если 3 и 4 символ - это дефис', () => {
      const validate = email();
      const error = validate('email@aa--a.com');

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если точка в начале домена', () => {
      const validate = email();
      const error = validate('email@.aaa.com');

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });
  });

  it('Email невалиден, если длина больше 254', () => {
    const value = `${'a'.repeat(254)}@email.com`;
    const validate = email();
    const error = validate(value);

    expect(error?.message).toBe(LENGTH_EMAIL_ERROR_INFO.message);
  });

  it('Email валиден, если длина равна 254', () => {
    const value = `${'a'.repeat(244)}@email.com`;
    const validate = email();
    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it.each(['email@ email.com', 'email @email.com', 'email @ email.com'])(
    'Email "%s" невалиден, если вокруг "@" есть пробелы',
    (value) => {
      const validate = email();
      const error = validate(value);

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    },
  );

  it('Дефолтный message переопределяется через параметры', () => {
    const customMessage = 'CustomMessage';
    const validate = email({ message: customMessage });
    const error = validate('test@');

    expect(error?.message).toBe(customMessage);
  });
});
