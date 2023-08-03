import { SURNAME_ERROR_INFO } from './constants';
import { surname } from './surname';

describe('surname', () => {
  it.each([
    ['Иванов', 'Valid for: Иванов. Допускаются только буквы в начале и конце'],
    ['иванов', 'Valid for: иванов. Допускаются строчные буквы'],
    ['И', 'Valid for: И. Допускается минимальное количество символов - 1'],
  ])('%s: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it.each([
    [
      'Иванов-Иванов',
      'Valid for: Иванов-Иванов. Допускается дефис между буквами',
    ],
    [
      'Иванов Иванов',
      'Valid for: Иванов Иванов. Допускается пробел между буквами',
    ],
    [
      'Иванов.Иванов',
      'Valid for: Иванов.Иванов. Допускается точка между буквами',
    ],
    [
      'Иванов,Иванов',
      'Valid for: Иванов,Иванов. Допускается запятая между буквами',
    ],
    [
      '(Иванов)',
      'Valid for: (Иванов). Допускается открывающая и закрывающая скобка',
    ],
  ])('%s: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it.each([
    [
      'Генрих-V',
      'Valid for: Генрих-V. Допускается прописная (большая) буква: V латинского алфавита',
    ],
    [
      'Генрих-I',
      'Valid for: Генрих-I. Допускается прописная (большая) буква: I латинского алфавита',
    ],
    ['Д’‎Анжело', 'Valid for: Д’‎Анжело. Допускается апостроф'],
  ])('%s: %s', (value) => {
    expect(surname()(value)).toBeUndefined();
  });

  it.each([
    [
      'а'.repeat(201),
      'Invalid for: ааа........ Допускается максимальное количество символов - 200',
    ],
    ['', 'Invalid for: "". Допускается минимальное количество символов - 1'],
    [
      'Иванов  Иванов',
      'Invalid for: Иванов  Иванов. Не допускаются двойные пробелы между буквами',
    ],
    [
      'Иванов--Иванов',
      'Invalid for: Иванов--Иванов. Не допускаются последовательно два спецсимвола',
    ],
  ])('%s: %s', (value) => {
    const error = surname()(value);

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it('123Иванов: Invalid for: 123Иванов. Допускаются только буквы в начале и конце, кроме открывающей и закрывающей скобки', () => {
    const value = '123Иванов';
    const error = surname()(value);

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it.each([
    [
      'Генрих-v',
      'Invalid for: Генрих-v. Допускается прописная (большая) буква: V латинского алфавита',
    ],
    [
      'Генрих-i',
      'Invalid for: Генрих-i. Допускается прописная (большая) буква: I латинского алфавита',
    ],
    ['Ivanov', 'Invalid for: Ivan. Допускаются только буквы русского алфавита'],
  ])('%s: %s', (value) => {
    const error = surname()(value);

    expect(error?.cause.code).toBe(SURNAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = surname({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
