import {
  AsyncIndependentValidationRule,
  AsyncValidationRule,
  callAsyncRule,
  createContext,
} from '../../core';

// TODO: необходимо добавить возможность использовать вложенные guards

/**
 * @description Выключает проверку на required в guard. Предназначен для асинхронных правил.
 * @example object({ name: optionalAsync(stringAsync(min(22))) })
 */
export const optionalAsync =
  <TLastSchemaValues extends Record<string, unknown>>(
    rule: AsyncValidationRule<unknown, TLastSchemaValues>,
  ): AsyncIndependentValidationRule<unknown, TLastSchemaValues> =>
  async (value, ctx) => {
    return callAsyncRule(
      rule,
      value,
      createContext(ctx, value, { isOptional: true }),
    );
  };
