import { ValidationErrorMap, ValidationObjectErrorCause } from '../ErrorMap';
import { ValidationSimpleError } from '../../SimpleError';

/**
 * @description Создает map ошибок валидаций
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
