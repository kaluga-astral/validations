export const declensionOfWords = (words: string[]) => (n: number) => {
  const number = Math.abs(n) % 100;
  const n1 = number % 10;

  if (number > 10 && number < 20) {
    return words[2];
  }

  if (n1 > 1 && n1 < 5) {
    return words[1];
  }

  if (n1 === 1) {
    return words[0];
  }

  return words[2];
};
