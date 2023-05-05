import {
  ErrorInfo,
  Guard,
  ValidationArrayError,
  ValidationErrorMap,
  ValidationResult,
  ValidationSimpleError,
} from '../core';

type PlainSimpleError = ErrorInfo;
type PlainArrayResult = Array<
  ErrorInfo[] | PlainSimpleError | PlainErrorMap | PlainArrayResult | undefined
>;
type PlainErrorMap = {
  [key: string]: PlainSimpleError | PlainArrayResult | PlainErrorMap;
};

/**
 * @description Результат валидации, преобразованный в простые структуры данных (исходные - это инстансы error)
 */
export type PlainValidationResult =
  | undefined
  | PlainSimpleError
  | PlainArrayResult
  | PlainErrorMap;

const toPlainSimpleError = (
  error: ValidationSimpleError,
): PlainSimpleError => ({
  message: error.message,
  code: error.cause.code,
});

const toPlainArrayResult = (error: ValidationArrayError): PlainArrayResult =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  error.cause.errorArray.map((errorItem) => generatePlainError(errorItem));

function toPlainErrorMap(error: ValidationErrorMap): PlainErrorMap {
  return Object.entries(error.cause.errorMap).reduce<PlainErrorMap>(
    (plainErrorMap, [key, currentError]) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const plainError = generatePlainError(currentError);

      if (plainError === undefined) {
        return plainErrorMap;
      }

      plainErrorMap[key] = plainError;

      return plainErrorMap;
    },
    {},
  );
}

function generatePlainError(
  validationResult: ValidationResult,
): PlainValidationResult {
  if (!validationResult) {
    return undefined;
  }

  if (validationResult instanceof ValidationErrorMap) {
    return toPlainErrorMap(validationResult);
  }

  if (validationResult instanceof ValidationArrayError) {
    return toPlainArrayResult(validationResult);
  }

  return toPlainSimpleError(validationResult);
}

/**
 * @description Форматирует все ошибки валидации в простые объекты. Необходим для интеграции с другими библиотеками
 * @param guard - любой guard
 * @example
 * ```ts
 *  const validate = toPlainError(
 *   object<{ info: Array<{ name: string }> }>({
 *     info: array(
 *       arrayItem(
 *         object<{ name: string }>(
 *           { name: string() }
 *         )
 *       )
 *     ),
 *   }),
 * );
 *
 *  // { info: [{ name: { code: Symbol(string), message: 'Не является строкой' } }] }
 *  console.log(validate({ info: [{ name: 22 }] }));
 * ```
 */
export const toPlainError =
  <TValues>(guard: Guard<unknown, TValues>) =>
  (value: unknown): PlainValidationResult =>
    generatePlainError(guard(value));
