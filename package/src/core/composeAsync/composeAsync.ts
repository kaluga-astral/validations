import {
  AsyncIndependentValidationRule,
  AsyncValidationRule,
  IndependentValidationRule,
  ValidationRule,
  callAsyncRule,
} from '../rule';
import { ValidationContext } from '../context';

/**
 * @description Объединяет переданные ассинхронные правила в цепочку правил, останавливает выполнение цепочки, если появилась ошибка. Выполняет правила слева направо
 * @example composeAsync(stringAsync(), max());
 */
export const composeAsync =
  <ValidationType, TLastSchemaValues extends Record<string, unknown>>(
    ...rules: Array<
      | IndependentValidationRule<ValidationType, TLastSchemaValues>
      | AsyncIndependentValidationRule<ValidationType, TLastSchemaValues>
      | ValidationRule<ValidationType, TLastSchemaValues>
      | AsyncValidationRule<ValidationType, TLastSchemaValues>
    >
  ): AsyncIndependentValidationRule<ValidationType, Record<string, unknown>> =>
  async (value, ctx) => {
    let result;

    for (const rule of rules) {
      result = await callAsyncRule(
        rule,
        value,
        ctx as ValidationContext<TLastSchemaValues>,
      );

      if (result) {
        break;
      }
    }

    return result;
  };
