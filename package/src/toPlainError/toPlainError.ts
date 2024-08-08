import {
  ValidationArrayError,
  ValidationErrorMap,
  type ValidationResult,
  type ValidationSimpleError,
} from '../core';

import { generateArrayPath, generateObjectPath } from './utils';

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
  params: { path: string },
) => TPlainSimpleError;

/**
 * Результат валидации, преобразованный в простые структуры данных (исходные - это инстансы error)
 */
export type PlainValidationResult<TPlainSimpleError> =
  | undefined
  | TPlainSimpleError
  | PlainArrayResult<TPlainSimpleError>
  | PlainErrorMap<TPlainSimpleError>;

const toPlainArrayResult = <TPlainSimpleError>(
  error: ValidationArrayError,
  formatErrorInfo: FormatSimpleErrorFunc<TPlainSimpleError>,
  path: string,
): PlainArrayResult<TPlainSimpleError> =>
  error.cause.errorArray.map((errorItem, index) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    toPlainError<TPlainSimpleError>(
      errorItem,
      formatErrorInfo,
      generateArrayPath(index, path),
    ),
  );

function toPlainErrorMap<TPlainSimpleError>(
  error: ValidationErrorMap,
  formatErrorInfo: FormatSimpleErrorFunc<TPlainSimpleError>,
  path: string,
): PlainErrorMap<TPlainSimpleError> {
  return Object.entries(error.cause.errorMap).reduce<
    PlainErrorMap<TPlainSimpleError>
  >((plainErrorMap, [key, currentError]) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const plainError = toPlainError<TPlainSimpleError>(
      currentError,
      formatErrorInfo,
      generateObjectPath(key, path),
    );

    if (plainError === undefined) {
      return plainErrorMap;
    }

    plainErrorMap[key] = plainError;

    return plainErrorMap;
  }, {});
}

/**
 * Форматирует все ошибки валидации в простые объекты. Необходим для интеграции с другими библиотеками
 * @param validationResult
 * @param formatErrorInfo - позволяет отформатировать объект ошибки при его формировании
 * @param path - путь до ошибки в схеме
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
  path: string = '',
): PlainValidationResult<TPlainSimpleError> => {
  if (!validationResult) {
    return undefined;
  }

  if (validationResult instanceof ValidationErrorMap) {
    return toPlainErrorMap<TPlainSimpleError>(
      validationResult,
      formatErrorInfo,
      path,
    );
  }

  if (validationResult instanceof ValidationArrayError) {
    return toPlainArrayResult<TPlainSimpleError>(
      validationResult,
      formatErrorInfo,
      path,
    );
  }

  return formatErrorInfo(validationResult, { path });
};
