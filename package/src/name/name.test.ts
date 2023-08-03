import { NAME_ERROR_INFO } from './constants';
import { name } from './name';

describe('name', () => {
  it.each([
    ['Иван', 'Valid for: Иван. Допускаются только буквы в начале и конце'],
    ['иван', 'Valid for: иван. Допускаются строчные буквы'],
    ['И', 'Valid for: И. Допускается минимальное количество символов - 1'],
  ])('%s: %s', (value) => {
    expect(name()(value)).toBeUndefined();
  });

  it.each([
    ['Иван-Иван', 'Valid for: Иван-Иван. Допускается дефис между буквами'],
    ['Иван Иван', 'Valid for: Иван Иван. Допускается пробел между буквами'],
    ['Иван.Иван', 'Valid for: Иван.Иван. Допускается точка между буквами'],
    ['Иван,Иван', 'Valid for: Иван,Иван. Допускается запятая между буквами'],
    [
      '(Иван)',
      'Valid for: (Иван). Допускается открывающая и закрывающая скобка',
    ],
  ])('%s: %s', (value) => {
    expect(name()(value)).toBeUndefined();
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
    expect(name()(value)).toBeUndefined();
  });

  it.each([
    [
      'а'.repeat(201),
      'Invalid for: ааа........ Допускается максимальное количество символов - 200',
    ],
    ['', 'Invalid for: "". Допускается минимальное количество символов - 1'],
    [
      'Иван  Иван',
      'Invalid for: Иван  Иван. Не допускаются двойные пробелы между буквами',
    ],
    [
      'Иван--Иван',
      'Invalid for: Иван--Иван. Не допускаются последовательно два спецсимвола',
    ],
  ])('%s: %s', (value) => {
    const error = name()(value);

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it('123Иван: Invalid for: 123Иван. Допускаются только буквы в начале и конце, кроме открывающей и закрывающей скобки', () => {
    const value = '123Иван';
    const error = name()(value);

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
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
    ['Ivan', 'Invalid for: Ivan. Допускаются только буквы русского алфавита'],
  ])('%s: %s', (value) => {
    const error = name()(value);

    expect(error?.cause.code).toBe(NAME_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = name({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
