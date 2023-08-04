import { isStartsWithAndEndsWithLetter } from './isStartsWithAndEndsWithLetter';

describe('isStartsWithAndEndsWithLetter', () => {
  it.each(['123Иван', 'Иван123', '123Иван123'])(
    'Invalid for %s: Может начинаться только с буквы и заканчиваться только буквой',
    (value) => {
      expect(isStartsWithAndEndsWithLetter(value)).toBeTruthy();
    },
  );

  it.each(['(Иван)', '(Иван', 'Иван)'])(
    'Invalid for %s: Допускается открывающая и закрывающая скобка',
    (value) => {
      expect(isStartsWithAndEndsWithLetter(value)).toBeFalsy();
    },
  );
});
