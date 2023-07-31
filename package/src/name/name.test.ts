import { NAME_ERROR_INFO } from './constants';
import { name } from './name';

describe('name', () => {
  it.each<string>(['Иван'])('Должно быть валидно для: %s', (value) => {
    expect(name()(value)).toBeUndefined();
  });

  it('Должна возвращать ошибку, если длина имени недопустимая', () => {
    const error = name()(''); // пустое имя

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если имя содержит недопустимые символы', () => {
    const error = name()('Иван@Иван'); // имя с недопустимым символом "@"

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если имя не начинается или не заканчивается буквой', () => {
    const error = name()('123Иван'); // имя, начинающееся с числа

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если имя содержит два или более подряд идущих спецсимволов или пробелы', () => {
    const error = name()('Иван  Иван'); // имя с двумя подряд идущими пробелами

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = name({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
