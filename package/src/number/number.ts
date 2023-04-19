import { ValidationRule, createGuard } from '../core';

export const number = <TValues>(
  ...numberRules: ValidationRule<number, TValues>[]
) => createGuard<number, TValues>(() => undefined);
