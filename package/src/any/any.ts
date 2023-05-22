import { createRule, compose } from '../core';

export const any = <TValues>() => createRule<unknown, TValues>();
