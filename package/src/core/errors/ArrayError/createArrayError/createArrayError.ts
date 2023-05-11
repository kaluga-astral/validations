import { ValidationArrayError, ValidationArrayErrorCause } from '../ArrayError';
import { ValidationSimpleError } from '../../SimpleError';

/**
 * @description Создает array ошибок. Ошибка предназначена для результата валидации массива
 */
export const createArrayError = (
  errorArray: ValidationArrayErrorCause['errorArray'],
) => {
  const firstErrorIndex = errorArray.findIndex((error) => Boolean(error));
  const firstError = errorArray[firstErrorIndex] as ValidationSimpleError;

  return new ValidationArrayError(
    `Ошибка в item[${firstErrorIndex}]: ${firstError.message}`,
    {
      cause: { errorArray, code: firstError.cause.code },
    },
  );
};
