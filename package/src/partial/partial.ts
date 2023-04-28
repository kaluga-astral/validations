import { Guard, createRule } from '../core';

export const partial = <TValues>(objectRule: Guard<object, TValues>) =>
  createRule<unknown, TValues>((value, ctx) =>
    objectRule.define({ isPartial: true })(value, {
      ...ctx,
      overrides: {
        ...ctx.overrides,
        object: { ...ctx.overrides.object, isPartial: true },
      },
    }),
  );
