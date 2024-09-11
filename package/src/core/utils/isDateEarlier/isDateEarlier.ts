import { resetTime } from '../resetTime';

export const isDateEarlier = (dateA: Date, dateB: Date) => {
  return resetTime(dateA).getTime() < resetTime(dateB).getTime();
};
