/**
 * Гененирует path для массива
 */
export const generateArrayPath = (index: number, prevPath?: string): string => {
  if (prevPath) {
    return `${prevPath}.${index}`;
  }

  return String(index);
};
