import { isStartsWithAndEndsWithLetter } from './isStartsWithAndEndsWithLetter';

describe('isStartsWithAndEndsWithLetter', () => {
  it.each(['123Иван', 'Иван123', '123Иван123'])(
    'Возвращает true для "%s" по соответствию условию: Может начинаться только с буквы и заканчиваться только буквой',
    (value) => {
      expect(isStartsWithAndEndsWithLetter(value)).toBeTruthy();
    },
  );

  it.each(['(Иван)', '(Иван', 'Иван)'])(
    'Возвращает false для "%s" потому, что не допускается открывающая и закрывающая скобка',
    (value) => {
      expect(isStartsWithAndEndsWithLetter(value)).toBeFalsy();
    },
  );
});
