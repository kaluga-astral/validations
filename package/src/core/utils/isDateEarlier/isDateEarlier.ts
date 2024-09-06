import { normalizeDate } from '../normalizeDate';

export const isDateEarlier = (dateA: Date, dateB: Date) => {
  const normalizetDateA = normalizeDate(dateA);
  const normalizeDateB = normalizeDate(dateB);

  return normalizetDateA.getTime() < normalizeDateB.getTime();
};
