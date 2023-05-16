import { createRule } from '../core';

import { PATTERN_ERROR_CODE } from './constants';

type PatternValidationTypes = string;
type PatternParams = {
  message?: string;
};

export const pattern = <ValidationType extends PatternValidationTypes>(
  regex: RegExp,
  params?: PatternParams,
) =>
  createRule<ValidationType, unknown>((value, ctx) => {
    if (!regex.test(value)) {
      return ctx.createError({
        code: PATTERN_ERROR_CODE,
        message:
          params?.message ||
          `Должно подходить под регулярное выражение: "${regex}"`,
      });
    }

    return undefined;
  });
