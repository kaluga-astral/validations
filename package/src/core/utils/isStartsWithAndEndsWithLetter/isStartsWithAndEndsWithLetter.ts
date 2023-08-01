/**
 * @description Проверяет, что текст начинается с буквы и заканчивается буквой, кроме скобок ()
 */
export const isStartsWithAndEndsWithLetter = (value: string): boolean =>
  !/^[а-яёА-ЯЁ(][а-яёА-ЯЁ' .,\-)’’‎]*?[а-яёА-ЯЁ)]$/.test(value);
