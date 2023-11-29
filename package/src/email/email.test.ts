import { expect } from 'vitest';

import {
  EMAIL_MAX_LENGTH,
  INVALID_EMAIL_ERROR_INFO,
  LENGTH_EMAIL_ERROR_INFO,
} from './constants';
import { email } from './email';

const getLongEmail = () => `${'a'.repeat(EMAIL_MAX_LENGTH)}@test.com`;

describe('email', () => {
  it.each<string>(['a', '@mail.ru', 'mail.ru', 'test@.ru', 'test.ru@'])(
    'Возвращает ошибку для "%s"',
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
  ])('Не возвращает ошибку для "%s"', (value) => {
    const validate = email();
    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it('Validate default invalid length message', () => {
    const validate = email();
    const error = validate(getLongEmail());

    expect(error?.message).toBe(LENGTH_EMAIL_ERROR_INFO.message);
  });

  it('Позволяет указать кастомный message ошибки', () => {
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
