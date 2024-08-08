/**
 * Гененирует path для объекта
 */
export const generateObjectPath = (key: string, prevPath?: string): string => {
  if (prevPath) {
    return `${prevPath}.${key}`;
  }

  return key;
};
