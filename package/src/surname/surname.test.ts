import {
  ALPHANUM_SURNAME_ERROR_INFO,
  DOUBLE_SYMBOL_ERROR_INFO,
  LETTER_BEGINNING_ERROR_INFO,
  LETTER_ENDING_ERROR_INFO,
} from './constants';
import { surname } from './surname';

describe('surname', () => {
  it.each<string>(["О'-Коннор", "Д' Артаньян"])('Valid for: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it.each<string>(['iPhone', 'Прiвет', "i''-Ку-ку", "v''Анжело"])(
    'Invalid for: %s',
    (value) => {
      const error = surname()(value);

      expect(error?.cause.code).toBe(ALPHANUM_SURNAME_ERROR_INFO.code);
    },
  );

  it('Возвращает ошибку, если фамилия содержит два или более подряд идущих спецсимвола', () => {
    const error = surname()('Крав- цов');

    expect(error?.cause.code).toBe(DOUBLE_SYMBOL_ERROR_INFO.code);
  });

  it.each<string>([
    'фреско',
    '-Кравцов',
    'щекочихин-Крестовоздвиженский',
    "д''Анжело",
  ])('Invalid for: %s', (value) => {
    const error = surname()(value);

    expect(error?.cause.code).toBe(LETTER_BEGINNING_ERROR_INFO.code);
  });

  it('Возвращает ошибку, если на конце фамилии не строчная буква', () => {
    const error = surname()('ФрескО');

    expect(error?.cause.code).toBe(LETTER_ENDING_ERROR_INFO.code);
  });

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';

    const error = surname({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });

  it('Valid exclude value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(surname({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
