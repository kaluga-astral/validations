import { PATRONYMIC_ERROR_INFO } from './constants';
import { patronymic } from './patronymic';

describe('patronymic', () => {
  it.each([
    [
      'Иванович',
      'Valid for: Иванович. Допускаются только буквы в начале и конце',
    ],
    ['Иванович', 'Valid for: Иванович. Допускаются строчные буквы'],
    ['И', 'Valid for: И. Допускается минимальное количество символов - 1'],
  ])('%s: %s', (value) => {
    expect(patronymic()(value)).toBeUndefined();
  });

  it.each([
    [
      'Иванович-Иванович',
      'Valid for: Иванович-Иванович. Допускается дефис между буквами',
    ],
    [
      'Иванович Иванович',
      'Valid for: Иванович Иванович. Допускается пробел между буквами',
    ],
    [
      'Иванович.Иванович',
      'Valid for: Иванович.Иванович. Допускается точка между буквами',
    ],
    [
      'Иванович,Иванович',
      'Valid for: Иванович,Иванович. Допускается запятая между буквами',
    ],
    [
      '(Иванович)',
      'Valid for: (Иванович). Допускается открывающая и закрывающая скобка',
    ],
  ])('%s: %s', (value) => {
    expect(patronymic()(value)).toBeUndefined();
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
    expect(patronymic()(value)).toBeUndefined();
  });

  it.each([
    [
      'а'.repeat(201),
      'Invalid for: ааа........ Допускается максимальное количество символов - 200',
    ],
    ['', 'Invalid for: "". Допускается минимальное количество символов - 1'],
    [
      'Иванович  Иванович',
      'Invalid for: Иванович  Иванович. Не допускаются двойные пробелы между буквами',
    ],
    [
      'Иванович--Иванович',
      'Invalid for: Иванович--Иванович. Не допускаются последовательно два спецсимвола',
    ],
  ])('%s: %s', (value) => {
    const error = patronymic()(value);

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
  });

  it('123Иванович: Invalid for: 123Иванович. Допускаются только буквы в начале и конце, кроме открывающей и закрывающей скобки', () => {
    const value = '123Иванович';
    const error = patronymic()(value);

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
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
    const error = patronymic()(value);

    expect(error?.cause.code).toBe(PATRONYMIC_ERROR_INFO.code);
  });

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = patronymic({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
