import {
  Schema,
  ValidationErrorMap,
  object,
  toPlainError,
} from '@astral/revizor';
import {
  FieldValues,
  Resolver,
  ResolverOptions,
  ResolverResult,
  useForm,
} from 'react-hook-form';
import { toNestError, validateFieldsNatively } from '@hookform/resolvers';

export const revizorResolver =
  <TFieldValues extends FieldValues = FieldValues>(
    schema: Schema<TFieldValues, unknown>,
  ): Resolver<TFieldValues> =>
  (values, _, options) => {
    const result = toPlainError(object<TFieldValues>(schema)(values));

    options.fields.name.ref;

    if (result) {
      return { values: {}, errors: result };
    }
  };
