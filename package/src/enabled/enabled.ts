import { any } from '../any';
import {
  type ValidationContext,
  type ValidationRule,
  callRule,
  createRule,
} from '../core';

type Params<TLastSchemaValues extends Record<string, unknown>> = {
  /**
   * @description Условие для включения схемы
   */
  is: (value: unknown, ctx: ValidationContext<TLastSchemaValues>) => boolean;
  /**
   * Схема валидации, применяемая если is === true
   */
  schema: ValidationRule<unknown, TLastSchemaValues>;
};

export const enabled = <TLastSchemaValues extends Record<string, unknown>>({
  is,
  schema,
}: Params<TLastSchemaValues>) => {
  return createRule<unknown, TLastSchemaValues>((value, ctx) => {
    if (is(value, ctx)) {
      return callRule(schema, value, ctx);
    }

    return callRule(any(), value, ctx);
  });
};
