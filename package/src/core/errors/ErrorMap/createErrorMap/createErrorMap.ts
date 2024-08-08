import {
  ValidationErrorMap,
  type ValidationObjectErrorCause,
} from '../ErrorMap';
import { type ValidationSimpleError } from '../../SimpleError';

/**
 * Создает map ошибок валидаций. Ошибка предназначена для генерации результата валидации объекта
 */
export const createErrorMap = (
  errorMap: ValidationObjectErrorCause['errorMap'],
) => {
  const [firstErrorPath, firstError] = Object.entries(errorMap).find(
    ([, error]) => Boolean(error),
  ) as [string, ValidationSimpleError];

  return new ValidationErrorMap(
    `Ошибка в свойстве ${firstErrorPath}: ${firstError.message}`,
    {
      cause: { errorMap, code: firstError.cause.code },
    },
  );
};
