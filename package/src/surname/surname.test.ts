import { SURNAME_ERROR_INFO } from './constants';
import { surname } from './surname';

describe('surname', () => {
  it.each<string>(['15657325992', '95145370513'])('Valid for: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it('Возвращает ошибку, если фамилия содержит два или более подряд идущих спецсимволов', () => {
    const error = surname()('Кра--вцов');

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it.each<string>(['\'ФрескО', 'Кра--вцов', 'щекочихин-Крестовоздвиженский', 'Д\'\'Анжело'])(
    'Invalid for: %s',
    (value) => {
      const error = surname()(value);

      expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
    },
  );

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';

    const error = surname({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
