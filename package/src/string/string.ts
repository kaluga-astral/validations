import { ValidationRule, compose, createGuard } from '../core';

import { STRING_TYPE_ERROR_INFO } from './constants';

export const string = <TValues>(...rules: ValidationRule<string, TValues>[]) =>
  createGuard<TValues>((value, ctx, { typeErrorMessage }) => {
    if (typeof value !== 'string') {
      return ctx.createError({
        ...STRING_TYPE_ERROR_INFO,
        message: typeErrorMessage || STRING_TYPE_ERROR_INFO.message,
      });
    }

    return compose<string, TValues>(...rules)(value, ctx);
  });
