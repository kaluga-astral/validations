import { Schema, object, toPlainError } from '@astral/validations';
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
  get,
} from 'react-hook-form';
import { validateFieldsNatively } from '@hookform/resolvers';

export const revizorResolver =
  <TFieldValues extends FieldValues = FieldValues>(
    schema: Schema<TFieldValues, TFieldValues>,
  ): Resolver<TFieldValues> =>
  (values, _, options) => {
    const validationResult = object<TFieldValues, TFieldValues>(schema)(values);

    if (validationResult) {
      const resolverError = toPlainError<FieldError>(
        validationResult,
        (err, { path }) => {
          return {
            message: err.message,
            type: err.cause.code,
            ref: get(options.fields, path)?.ref,
          };
        },
      ) as FieldErrors<TFieldValues>;

      return { values: {}, errors: resolverError };
    }

    if (options.shouldUseNativeValidation) {
      validateFieldsNatively({}, options);
    }

    return { errors: {}, values };
  };
