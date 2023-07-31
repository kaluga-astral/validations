import { SURNAME_ERROR_INFO } from './constants';
import { surname } from './surname';

describe('surname', () => {
  it.each<string>(['Иванов'])('Должно быть валидно для: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it('Должна возвращать ошибку, если длина фамилии недопустимая', () => {
    const error = surname()('');

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если фамилия содержит недопустимые символы', () => {
    const error = surname()('Иванов@Иванов');

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если фамилия не начинается или не заканчивается буквой', () => {
    const error = surname()('123Иванов');

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если фамилия содержит два или более подряд идущих спецсимволов или пробелы', () => {
    const error = surname()('Иванов  Иванов');

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = surname({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
