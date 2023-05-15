import { Schema, ValidationErrorMap, object } from '@astral/revizor';
import {
  FieldValues,
  Resolver,
  ResolverOptions,
  ResolverResult,
  useForm,
} from 'react-hook-form';
import { validateFieldsNatively, toNestError } from '@hookform/resolvers';

export const revizorResolver =
  <TFieldValues extends FieldValues = FieldValues>(
    schema: Schema<TFieldValues, unknown>,
  ): Resolver<TFieldValues> =>
  (values, _, options) => {
    const result = object<TFieldValues>(schema)(values);

    if (result) {
      return { values: {}, errors: result };
    }
  };
