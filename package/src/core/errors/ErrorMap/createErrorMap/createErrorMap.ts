import { ValidationErrorMap } from '../ErrorMap';
import { ValidationSimpleError } from '../../SimpleError';

/**
 * @description Создает map ошибок валидаций. Ошибка предназначена для генерации результата валидации объекта
 */
export const createErrorMap = (
  errorMap: ValidationErrorMap['errorMap'],
): ValidationErrorMap => {
  const [firstErrorPath, firstError] = Object.entries(errorMap).find(
    ([, error]) => Boolean(error),
  ) as [string, ValidationSimpleError];

  return {
    message: `Ошибка в свойстве ${firstErrorPath}: ${firstError.message}`,
    code: firstError.code,
    errorMap,
  };
};
