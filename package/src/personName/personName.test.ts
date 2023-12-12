import { PERSON_NAME_ERROR_INFO } from './constants';
import { personName } from './personName';

describe('personName', () => {
  it.each(['Иван', 'ИВАН', 'иван', 'ивАн', 'ИваН', 'иВАн'])(
    'Valid for %s: Допускаются прописные (большие) и строчные буквы русского алфавита',
    (value) => {
      expect(personName()(value)).toBeUndefined();
    },
  );

  it.each(['Ёлка', 'ёлка', 'чутьё', 'берёза'])(
    'Valid for %s: Допускается буква ё',
    (value) => {
      expect(personName()(value)).toBeUndefined();
    },
  );

  it('Допускается дефис между буквами', () => {
    expect(personName()('Иван-Иван')).toBeUndefined();
  });

  it('Допускается пробел между буквами', () => {
    expect(personName()('Иван Иван')).toBeUndefined();
  });

  it('Допускается точка между буквами', () => {
    expect(personName()('Иван.Иван')).toBeUndefined();
  });

  it.each(['Генрих-V', 'Генрих-I', 'V-Генрих', 'I-Генрих'])(
    'Valid for %s: Допускаются прописные (большие) буквы: I, V латинского алфавита',
    (value) => {
      expect(personName()(value)).toBeUndefined();
    },
  );

  it('Допускается апостроф', () => {
    expect(personName()('Д’‎Анжело')).toBeUndefined();
  });

  it('Допускается запятая между буквами', () => {
    expect(personName()('Иван,Иван')).toBeUndefined();
  });

  it.each(['(Иван)', '(Иван', 'Иван)'])(
    'Valid for %s: Допускается открывающая и закрывающая скобка',
    (value) => {
      expect(personName()(value)).toBeUndefined();
    },
  );

  it('Допускается минимальное количество символов - 1', () => {
    expect(personName()('и')).toBeUndefined();
  });

  it('Допускается максимальное количество символов - 200', () => {
    expect(personName()('и'.repeat(200))).toBeUndefined();
  });

  it('Имя невалидно, если количество символов больше 200', () => {
    const error = personName()('и'.repeat(201));

    expect(error?.cause.code).toBe(PERSON_NAME_ERROR_INFO.code);
  });

  it.each([
    'Иван--Иван',
    'Иван++Иван',
    'Иван__Иван',
    'Иван//Иван',
    'Иван||Иван',
    'Иван??Иван',
    'Иван!!Иван',
    'Иван<<Иван',
    'Иван..Иван',
    'Иван,,Иван',
    'Иван::Иван',
    'Иван==Иван',
    'Иван@@Иван',
    'Иван``Иван',
    'Иван  Иван',
  ])(
    'Invalid for %s: Не может содержать последовательно два спецсимвола/пробела',
    (value) => {
      const error = personName()(value);

      expect(error?.cause.code).toBe(PERSON_NAME_ERROR_INFO.code);
    },
  );

  it.each(['Ivan', 'ivan', 'IVAN', 'Иvan', 'Daniel'])(
    'Invalid for %s: Допускаются прописные (большие) и строчные буквы русского алфавита',
    (value) => {
      const error = personName()(value);

      expect(error?.cause.code).toBe(PERSON_NAME_ERROR_INFO.code);
    },
  );

  it.each(['123Иван', 'Иван123', '123Иван123'])(
    'Invalid for %s: Может начинаться только с буквы и заканчиваться только буквой',
    (value) => {
      const error = personName()(value);

      expect(error?.cause.code).toBe(PERSON_NAME_ERROR_INFO.code);
    },
  );

  it.each(['Генрих-v', 'Генрих-i', 'v-Генрих', 'i-Генрих'])(
    'Invalid for %s: Допускаются прописные (большие) буквы: I, V латинского алфавита',
    (value) => {
      const error = personName()(value);

      expect(error?.cause.code).toBe(PERSON_NAME_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = personName({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
