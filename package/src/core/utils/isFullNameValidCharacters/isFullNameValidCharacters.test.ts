import { isFullNameValidCharacters } from './isFullNameValidCharacters';

describe('isFullNameValidCharacters', () => {
  it.each(['Иван', 'ИВАН', 'иван', 'ивАн', 'ИваН', 'иВАн'])(
    'Valid for %s: Допускаются прописные (большие) и строчные буквы русского алфавита',
    (value) => expect(isFullNameValidCharacters(value)).toBeFalsy(),
  );

  it.each(['Ёлка', 'ёлка', 'чутьё', 'берёза'])(
    'Valid for %s: Допускается буква ё',
    (value) => {
      expect(isFullNameValidCharacters(value)).toBeFalsy();
    },
  );

  it.each(['Генрих-V', 'Генрих-I', 'V-Генрих', 'I-Генрих'])(
    'Valid for %s: Допускаются прописные (большие) буквы: I, V латинского алфавита',
    (value) => {
      expect(isFullNameValidCharacters(value)).toBeFalsy();
    },
  );

  it('Допускается дефис между буквами', () => {
    expect(isFullNameValidCharacters('Иван-Иван')).toBeFalsy();
  });

  it('Допускается пробел между буквами', () => {
    expect(isFullNameValidCharacters('Иван Иван')).toBeFalsy();
  });

  it('Допускается точка между буквами', () => {
    expect(isFullNameValidCharacters('Иван.Иван')).toBeFalsy();
  });

  it('Допускается апостроф', () => {
    expect(isFullNameValidCharacters('Д’‎Анжело')).toBeFalsy();
  });

  it('Допускается запятая между буквами', () => {
    expect(isFullNameValidCharacters('Иван,Иван')).toBeFalsy();
  });

  it.each(['(Иван)', '(Иван', 'Иван)'])(
    'Valid for %s: Допускается открывающая и закрывающая скобка',
    (value) => {
      expect(isFullNameValidCharacters(value)).toBeFalsy();
    },
  );
});
