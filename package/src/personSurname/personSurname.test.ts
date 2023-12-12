import { PERSON_SURNAME_ERROR_INFO } from './constants';
import { personSurname } from './personSurname';

describe('personSurname', () => {
  it.each(['Иванов', 'ИВАНОВ', 'иванов', 'ивАнов', 'ИваноВ', 'иВАнов'])(
    'Valid for %s: Допускаются прописные (большие) и строчные буквы русского алфавита',
    (value) => {
      expect(personSurname()(value)).toBeUndefined();
    },
  );

  it.each(['Ёлка', 'ёлка', 'чутьё', 'берёза'])(
    'Valid for %s: Допускается буква ё',
    (value) => {
      expect(personSurname()(value)).toBeUndefined();
    },
  );

  it('Допускается дефис между буквами', () => {
    expect(personSurname()('Иванов-Иванов')).toBeUndefined();
  });

  it('Допускается пробел между буквами', () => {
    expect(personSurname()('Иванов Иванов')).toBeUndefined();
  });

  it('Допускается точка между буквами', () => {
    expect(personSurname()('Иванов.Иванов')).toBeUndefined();
  });

  it.each(['Генрих-V', 'Генрих-I', 'V-Генрих', 'I-Генрих'])(
    'Valid for %s: Допускаются прописные (большие) буквы: I, V латинского алфавита',
    (value) => {
      expect(personSurname()(value)).toBeUndefined();
    },
  );

  it('Допускается апостроф', () => {
    expect(personSurname()('Д’‎Анжело')).toBeUndefined();
  });

  it('Допускается запятая между буквами', () => {
    expect(personSurname()('Иванов,Иванов')).toBeUndefined();
  });

  it.each(['(Иванов)', '(Иванов', 'Иванов)'])(
    'Valid for %s: Допускается открывающая и закрывающая скобка',
    (value) => {
      expect(personSurname()(value)).toBeUndefined();
    },
  );

  it('Допускается минимальное количество символов - 1', () => {
    expect(personSurname()('и')).toBeUndefined();
  });

  it('Допускается максимальное количество символов - 200', () => {
    expect(personSurname()('и'.repeat(200))).toBeUndefined();
  });

  it('Фамилия невалидна, если количество символов больше 200', () => {
    const error = personSurname()('и'.repeat(201));

    expect(error?.cause.code).toBe(PERSON_SURNAME_ERROR_INFO.code);
  });

  it.each([
    'Иванов--Иванов',
    'Иванов++Иванов',
    'Иванов__Иванов',
    'Иванов//Иванов',
    'Иванов||Иванов',
    'Иванов??Иванов',
    'Иванов!!Иванов',
    'Иванов<<Иванов',
    'Иванов..Иванов',
    'Иванов,,Иванов',
    'Иванов::Иванов',
    'Иванов==Иванов',
    'Иванов@@Иванов',
    'Иванов``Иванов',
    'Иванов  Иванов',
  ])(
    'Invalid for %s: Не может содержать последовательно два спецсимвола/пробела',
    (value) => {
      const error = personSurname()(value);

      expect(error?.cause.code).toBe(PERSON_SURNAME_ERROR_INFO.code);
    },
  );

  it.each(['Ivanov', 'ivanov', 'IVANOV', 'Иvanов', 'Smith'])(
    'Invalid for %s: Допускаются прописные (большие) и строчные буквы русского алфавита',
    (value) => {
      const error = personSurname()(value);

      expect(error?.cause.code).toBe(PERSON_SURNAME_ERROR_INFO.code);
    },
  );

  it.each(['123Иванов', 'Иванов123', '123Иванов123'])(
    'Invalid for %s: Может начинаться только с буквы и заканчиваться только буквой',
    (value) => {
      const error = personSurname()(value);

      expect(error?.cause.code).toBe(PERSON_SURNAME_ERROR_INFO.code);
    },
  );

  it.each(['Генрих-v', 'Генрих-i', 'v-Генрих', 'i-Генрих'])(
    'Invalid for %s: Допускаются прописные (большие) буквы: I, V латинского алфавита',
    (value) => {
      const error = personSurname()(value);

      expect(error?.cause.code).toBe(PERSON_SURNAME_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = personSurname({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
