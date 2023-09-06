import { ValidationRule, compose, createGuard } from '../core';

import { STRING_TYPE_ERROR_INFO } from './constants';
import { isString } from './utils';

export const string = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: ValidationRule<string, TLastSchemaValues>[]
) =>
  createGuard<TLastSchemaValues>((value, ctx, { typeErrorMessage }) => {
    if (!isString(value)) {
      return ctx.createError({
        ...STRING_TYPE_ERROR_INFO,
        message: typeErrorMessage || STRING_TYPE_ERROR_INFO.message,
      });
    }

    return compose<string, TLastSchemaValues>(...rules)(value, ctx);
  });
