import { describe, expect } from 'vitest';

import {
  DOUBLE_DOTS_EMAIL_ERROR_INFO,
  EMAIL_MAX_LENGTH,
  INVALID_EMAIL_ERROR_INFO,
  LENGTH_EMAIL_ERROR_INFO,
} from './constants';
import { email } from './email';

const getLongEmail = () => `${'a'.repeat(EMAIL_MAX_LENGTH)}@test.com`;

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
      const value = 'f@email.com';
      const validate = email();
      const result = validate(value);

      expect(result).toBeUndefined();
    });

    it('Невалиден, если длина равна 0', () => {
      const value = '@email.com';
      const validate = email();
      const error = validate(value);

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если начинается с точки', () => {
      const value = '.sdsf@email.com';
      const validate = email();
      const error = validate(value);

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если начинается с тире', () => {
      const value = '-sdsf@email.com';
      const validate = email();
      const error = validate(value);

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если оканчивается точкой', () => {
      const value = 'sdsf.@email.com';
      const validate = email();
      const error = validate(value);

      expect(error?.message).toBe(INVALID_EMAIL_ERROR_INFO.message);
    });

    it('Невалиден, если есть две точки подряд', () => {
      const value = 'sd..sf@email.com';
      const validate = email();
      const error = validate(value);

      expect(error?.message).toBe(DOUBLE_DOTS_EMAIL_ERROR_INFO.message);
    });
  });

  describe('Hostname', () => {
    it('Невалиден, если есть две точки подряд', () => {
      const value = 'sdsf@email..com';
      const validate = email();
      const error = validate(value);

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

  it('Дефолтный message переопределяется через параметры', () => {
    const customMessage = 'CustomMessage';
    const validate = email({ message: customMessage });
    const error = validate('test@');

    expect(error?.message).toBe(customMessage);
  });

  it('Validate custom invalid length message', () => {
    const customMessage = 'CustomMessage';
    const validate = email({ invalidLengthMessage: customMessage });
    const error = validate(getLongEmail());

    expect(error?.message).toBe(customMessage);
  });
});
