import { AsyncValidationRule, ValidationRule, createAsyncGuard } from '../core';
import { string } from '../string';

export const stringAsync = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: Array<
    | ValidationRule<string, TLastSchemaValues>
    | AsyncValidationRule<string, TLastSchemaValues>
  >
) => createAsyncGuard<TLastSchemaValues, string>(string(), rules);
