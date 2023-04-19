import { ValidationRule, createGuard } from '../core';

export const string = <TValues>(
  ...stringRules: ValidationRule<string, TValues>[]
) => createGuard<string, TValues>(() => undefined);
