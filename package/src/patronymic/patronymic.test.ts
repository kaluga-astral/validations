import { PATRONYMIC_ERROR_INFO } from './constants';
import { patronymic } from './patronymic';

describe('patronymic', () => {
  it.each<string>(['Иванович'])('Должно быть валидно для: %s', (value) => {
    expect(patronymic()(value)).toBeUndefined();
  });

  it('Должна возвращать ошибку, если длина отчества недопустимая', () => {
    const error = patronymic()(''); // пустое отчество

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если отчество содержит недопустимые символы', () => {
    const error = patronymic()('Иванович@Иванович'); // имя с недопустимым символом "@"

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если отчество не начинается или не заканчивается буквой', () => {
    const error = patronymic()('123Иванович'); // отчество, начинающееся с числа

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку, если отчество содержит два или более подряд идущих спецсимволов или пробелы', () => {
    const error = patronymic()('Иванович  Иванович'); // отчество с двумя подряд идущими пробелами

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = patronymic({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
