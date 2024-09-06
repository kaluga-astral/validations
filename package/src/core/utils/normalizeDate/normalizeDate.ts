export const normalizeDate = (value: Date) => {
  const date = value.getDate();
  const month = value.getMonth();
  const year = value.getFullYear();

  return new Date(year, month, date, 0, 0, 0);
};
