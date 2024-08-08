/**
 * Проверяет, что текст начинается с буквы и заканчивается буквой, кроме скобок ()
 */
export const isStartsWithAndEndsWithLetter = (value: string): boolean =>
  !/^[IV а-яёА-ЯЁ()](?:.*[IV а-яёА-ЯЁ()])?$/.test(value);
