/**
 * @description Сбрасывает время для даты в 0
 * @param date
 */
export const resetTime = (date: Date): Date => {
  const copyDate = new Date(date);

  copyDate.setHours(0);
  copyDate.setMinutes(0);
  copyDate.setSeconds(0);
  copyDate.setMilliseconds(0);

  return copyDate;
};
