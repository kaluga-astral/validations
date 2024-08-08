import { type ValidationResult } from '../types';
import {
  type IndependentValidationRule,
  type ValidationRule,
  callRule,
} from '../rule';
import { type ValidationContext } from '../context';

/**
 * Объединяет переданные правила в цепочку правил, останавливает выполнение цепочки, если появилась ошибка. Выполняет правила слева направо
 * @example compose(min(), max());
 */
export const compose =
  <ValidationType, TLastSchemaValues extends Record<string, unknown>>(
    ...rules: Array<
      | IndependentValidationRule<ValidationType, TLastSchemaValues>
      | ValidationRule<ValidationType, TLastSchemaValues>
    >
  ): IndependentValidationRule<ValidationType, Record<string, unknown>> =>
  (value, ctx) =>
    rules.reduce<ValidationResult>(
      (result, rule) =>
        result ||
        callRule(rule, value, ctx as ValidationContext<TLastSchemaValues>),
      undefined,
    );
