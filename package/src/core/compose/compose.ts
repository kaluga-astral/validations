import { ValidationResult } from '../types';
import { CompositionalValidationRule, ValidationRule } from '../rule';
import { ValidationContext } from '../context';

/**
 * @description Объединяет переданные правила в цепочку правил, останавливает выполнение цепочки, если появилась ошибка. Выполняет правила слева направо
 * @example compose(min(), max());
 */
export const compose =
  <ValidationType, TValues>(
    ...rules: Array<
      | ValidationRule<ValidationType, TValues>
      | CompositionalValidationRule<ValidationType, TValues>
    >
  ): ValidationRule<ValidationType, TValues> =>
  (value, ctx) =>
    rules.reduce<ValidationResult>(
      (result, rule) =>
        result || rule(value, ctx as ValidationContext<TValues>),
      undefined,
    );
