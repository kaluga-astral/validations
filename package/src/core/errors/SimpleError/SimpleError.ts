import { type ErrorCode } from '../types';

/**
 * Причина ошибки валидации
 */
export type ValidationErrorData<AddCause extends Record<string, unknown>> = {
  cause: AddCause & {
    code: ErrorCode;
  };
};

/**
 * Простая ошибка правил валидации. Не имеет вложенных ошибок
 */
export class ValidationSimpleError<
  AddCause extends Record<string, unknown> = {},
> extends Error {
  cause: ValidationErrorData<AddCause>['cause'];

  constructor(message: string, data: ValidationErrorData<AddCause>) {
    super(message);
    this.cause = data.cause;
  }
}
