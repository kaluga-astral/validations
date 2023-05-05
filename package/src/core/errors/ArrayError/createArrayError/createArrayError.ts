import { ValidationArrayError } from '../ArrayError';
import { ValidationSimpleError } from '../../SimpleError';

/**
 * @description Создает array ошибок. Ошибка предназначена для результата валидации массива
 */
export const createArrayError = (
  errorArray: ValidationArrayError['errorArray'],
): ValidationArrayError => {
  const firstErrorIndex = errorArray.findIndex((error) => Boolean(error));
  const firstError = errorArray[firstErrorIndex] as ValidationSimpleError;

  return {
    message: `Ошибка в item[${firstErrorIndex}]: ${firstError.message}`,
    code: firstError.code,
    errorArray,
  };
};
