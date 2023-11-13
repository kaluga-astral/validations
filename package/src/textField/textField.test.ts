import { expect } from 'vitest';

import {
  INVALID_TEXT_FIELD_ERROR_INFO,
  LENGTH_TEXT_FIELD_ERROR_INFO,
  TEXT_FIELD_MAX_LENGTH,
} from './constants';
import { textField } from './textField';

const getLongText = () => `${'a'.repeat(TEXT_FIELD_MAX_LENGTH)}!`;

const customMessage = 'CustomMessage';

describe('textField', () => {
  it.each<string>([
    '!@#$%^&*()-_=+|[]{};:",.<>/?',
    '123',
    'abcABC',
    'абвАБВ',
    '   абв   ',
    '      ',
    'Авада кедавра...',
  ])('Валидное значение: %s', (value) => {
    const result = textField()(value);

    expect(result).toBeUndefined();
  });

  it.each<string>(['∑', '⛔️', '😀', '1⃣', '👍', '٩(◕‿◕｡)۶'])(
    'Невалидное значение: %s',
    (value) => {
      const error = textField()(value);

      expect(error?.cause.code).toEqual(INVALID_TEXT_FIELD_ERROR_INFO.code);
    },
  );

  it('Изменённое ограничение длины', () => {
    const error = textField({ customLength: 2 })('abcABC');

    expect(error?.message).toBe(LENGTH_TEXT_FIELD_ERROR_INFO.message);
  });

  it('Дефолтная ошибка при превышении длины', () => {
    const error = textField()(getLongText());

    expect(error?.message).toBe(LENGTH_TEXT_FIELD_ERROR_INFO.message);
  });

  it('Дефолтная ошибка при некорректных символах', () => {
    const error = textField()('😀');

    expect(error?.message).toBe(INVALID_TEXT_FIELD_ERROR_INFO.message);
  });

  it('Кастомная ошибка при превышении длины', () => {
    const validate = textField({ invalidLengthMessage: customMessage });
    const error = validate(getLongText());

    expect(error?.message).toBe(customMessage);
  });

  it('Кастомная ошибка при некорректных символах', () => {
    const error = textField({ message: customMessage })('😀');

    expect(error?.message).toBe(customMessage);
  });
});
