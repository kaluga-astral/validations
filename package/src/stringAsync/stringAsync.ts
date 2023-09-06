import {
  AsyncValidationRule,
  ValidationRule,
  composeAsync,
  createAsyncGuard,
} from '../core';
import { string } from '../string';

export const stringAsync = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: Array<
    | ValidationRule<string, TLastSchemaValues>
    | AsyncValidationRule<string, TLastSchemaValues>
  >
) =>
  createAsyncGuard<TLastSchemaValues>((value, ctx, defOptions) =>
    composeAsync<unknown, TLastSchemaValues>(
      string().define(defOptions),
      ...rules,
    )(value, ctx),
  );
