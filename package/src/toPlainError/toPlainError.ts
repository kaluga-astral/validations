import {
  ValidationArrayError,
  ValidationErrorMap,
  ValidationResult,
  ValidationSimpleError,
} from '../core';

type PlainArrayResult<TPlainSimpleError> = Array<
  | TPlainSimpleError
  | TPlainSimpleError[]
  | PlainErrorMap<TPlainSimpleError>
  | PlainArrayResult<TPlainSimpleError>
  | undefined
>;
type PlainErrorMap<TPlainSimpleError> = {
  [key: string]:
    | TPlainSimpleError
    | PlainArrayResult<TPlainSimpleError>
    | PlainErrorMap<TPlainSimpleError>;
};

type FormatSimpleErrorFunc<TPlainSimpleError> = (
  error: ValidationSimpleError,
) => TPlainSimpleError;

/**
 * @description Результат валидации, преобразованный в простые структуры данных (исходные - это инстансы error)
 */
export type PlainValidationResult<TPlainSimpleError> =
  | undefined
  | TPlainSimpleError
  | PlainArrayResult<TPlainSimpleError>
  | PlainErrorMap<TPlainSimpleError>;

const toPlainArrayResult = <TPlainSimpleError>(
  error: ValidationArrayError,
  formatErrorInfo: FormatSimpleErrorFunc<TPlainSimpleError>,
): PlainArrayResult<TPlainSimpleError> =>
  error.cause.errorArray.map((errorItem) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    toPlainError<TPlainSimpleError>(errorItem, formatErrorInfo),
  );

function toPlainErrorMap<TPlainSimpleError>(
  error: ValidationErrorMap,
  formatErrorInfo: FormatSimpleErrorFunc<TPlainSimpleError>,
): PlainErrorMap<TPlainSimpleError> {
  return Object.entries(error.cause.errorMap).reduce<
    PlainErrorMap<TPlainSimpleError>
  >((plainErrorMap, [key, currentError]) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const plainError = toPlainError<TPlainSimpleError>(
      currentError,
      formatErrorInfo,
    );

    if (plainError === undefined) {
      return plainErrorMap;
    }

    plainErrorMap[key] = plainError;

    return plainErrorMap;
  }, {});
}

/**
 * @description Форматирует все ошибки валидации в простые объекты. Необходим для интеграции с другими библиотеками
 * @param validationResult
 * @param formatErrorInfo - позволяет отформатировать объект ошибки при его формировании
 * @example
 * ```ts
 *  const validate = object<{ info: Array<{ name: string }> }>({
 *   info: array(
 *     arrayItem(
 *       object<{ name: string }>(
 *         { name: string() }
 *       )
 *     )
     ),
 *  }),
 *
 *  // { info: [{ name: { code: Symbol(string), message: 'Не является строкой' } }] }
 *  console.log(toPlainError(validate({ info: [{ name: 22 }] })));
 * ```
 */
export const toPlainError = <TPlainSimpleError>(
  validationResult: ValidationResult,
  formatErrorInfo: FormatSimpleErrorFunc<TPlainSimpleError>,
): PlainValidationResult<TPlainSimpleError> => {
  if (!validationResult) {
    return undefined;
  }

  if (validationResult instanceof ValidationErrorMap) {
    return toPlainErrorMap<TPlainSimpleError>(
      validationResult,
      formatErrorInfo,
    );
  }

  if (validationResult instanceof ValidationArrayError) {
    return toPlainArrayResult<TPlainSimpleError>(
      validationResult,
      formatErrorInfo,
    );
  }

  return formatErrorInfo(validationResult);
};
