import { CompositionalValidationRule, compose, createGuard } from '../core';

import { STRING_TYPE_ERROR_INFO } from './constants';

export const string = <TValues>(
  ...rules: CompositionalValidationRule<string, TValues>[]
) =>
  createGuard<string, TValues>((value, ctx, { typeErrorMessage }) => {
    if (typeof value !== 'string') {
      return {
        ...STRING_TYPE_ERROR_INFO,
        message: typeErrorMessage || STRING_TYPE_ERROR_INFO.message,
      };
    }

    return compose<string, TValues>(...rules)(value, ctx);
  });
