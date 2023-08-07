import { PERSON_PATRONYMIC_ERROR_INFO } from './constants';
import { personPatronymic } from './personPatronymic';

describe('personPatronymic', () => {
  it.each([
    'Иванович',
    'ИВАНОВИЧ',
    'иванович',
    'ивАнович',
    'ИвановиЧ',
    'иВАнович',
  ])(
    'Valid for %s: Допускаются прописные (большие) и строчные буквы русского алфавита',
    (value) => {
      expect(personPatronymic()(value)).toBeUndefined();
    },
  );

  it.each(['Ёлка', 'ёлка', 'чутьё', 'берёза'])(
    'Valid for %s: Допускается буква ё',
    (value) => {
      expect(personPatronymic()(value)).toBeUndefined();
    },
  );

  it('Допускается дефис между буквами', () => {
    expect(personPatronymic()('Иванович-Иванович')).toBeUndefined();
  });

  it('Допускается пробел между буквами', () => {
    expect(personPatronymic()('Иванович Иванович')).toBeUndefined();
  });

  it('Допускается точка между буквами', () => {
    expect(personPatronymic()('Иванович.Иванович')).toBeUndefined();
  });

  it.each(['Генрих-V', 'Генрих-I', 'V-Генрих', 'I-Генрих'])(
    'Valid for %s: Допускаются прописные (большие) буквы: I, V латинского алфавита',
    (value) => {
      expect(personPatronymic()(value)).toBeUndefined();
    },
  );

  it('Допускается апостроф', () => {
    expect(personPatronymic()('Д’‎Анжело')).toBeUndefined();
  });

  it('Допускается запятая между буквами', () => {
    expect(personPatronymic()('Иванович,Иванович')).toBeUndefined();
  });

  it.each(['(Иванович)', '(Иванович', 'Иванович)'])(
    'Valid for %s: Допускается открывающая и закрывающая скобка',
    (value) => {
      expect(personPatronymic()(value)).toBeUndefined();
    },
  );

  it('Допускается минимальное количество символов - 1', () => {
    expect(personPatronymic()('и')).toBeUndefined();
  });

  it('Допускается максимальное количество символов - 200', () => {
    expect(personPatronymic()('и'.repeat(200))).toBeUndefined();
  });

  it('Допускается максимальное количество символов - 200', () => {
    const error = personPatronymic()('и'.repeat(201));

    expect(error?.cause.code).toBe(PERSON_PATRONYMIC_ERROR_INFO.code);
  });

  it.each([
    'Иванович--Иванович',
    'Иванович++Иванович',
    'Иванович__Иванович',
    'Иванович//Иванович',
    'Иванович||Иванович',
    'Иванович??Иванович',
    'Иванович!!Иванович',
    'Иванович<<Иванович',
    'Иванович..Иванович',
    'Иванович,,Иванович',
    'Иванович::Иванович',
    'Иванович==Иванович',
    'Иванович@@Иванович',
    'Иванович``Иванович',
    'Иванович  Иванович',
  ])(
    'Invalid for %s: Не может содержать последовательно два спецсимвола/пробела',
    (value) => {
      const error = personPatronymic()(value);

      expect(error?.cause.code).toBe(PERSON_PATRONYMIC_ERROR_INFO.code);
    },
  );

  it.each(['Ivanovich', 'ivanovich', 'IVANOVICH', 'Иvanoviч', 'Smith'])(
    'Invalid for %s: Допускаются прописные (большие) и строчные буквы русского алфавита',
    (value) => {
      const error = personPatronymic()(value);

      expect(error?.cause.code).toBe(PERSON_PATRONYMIC_ERROR_INFO.code);
    },
  );

  it.each(['123Иванович', 'Иванович123', '123Иванович123'])(
    'Invalid for %s: Может начинаться только с буквы и заканчиваться только буквой',
    (value) => {
      const error = personPatronymic()(value);

      expect(error?.cause.code).toBe(PERSON_PATRONYMIC_ERROR_INFO.code);
    },
  );

  it.each(['Генрих-v', 'Генрих-i', 'v-Генрих', 'i-Генрих'])(
    'Invalid for %s: Допускаются прописные (большие) буквы: I, V латинского алфавита',
    (value) => {
      const error = personPatronymic()(value);

      expect(error?.cause.code).toBe(PERSON_PATRONYMIC_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = personPatronymic({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
