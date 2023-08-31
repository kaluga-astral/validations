import { ValidationResult } from '../types';
import { IndependentValidationRule, ValidationRule, callRule } from '../rule';
import { ValidationContext } from '../context';

/**
 * @description Объединяет переданные правила в цепочку правил, останавливает выполнение цепочки, если появилась ошибка. Выполняет правила слева направо
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
