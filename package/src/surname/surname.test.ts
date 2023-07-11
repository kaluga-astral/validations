import { SURNAME_ERROR_INFO } from './constants';
import { surname } from './surname';

describe('surname', () => {
  it.each<string>(['О\'-Коннор', 'Д\' Артаньян'])('Valid for: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it('Возвращает ошибку, если фамилия содержит два или более подряд идущих спецсимвола', () => {
    const error = surname()('Крав- цов');

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it.each<string>([
    '\'ФрескО',
    'Кра--вцов',
    'щекочихин-Крестовоздвиженский',
    'Д\'\'Анжело',
  ])('Invalid for: %s', (value) => {
    const error = surname()(value);

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
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
