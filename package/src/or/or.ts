import {
  ValidationResult,
  ValidationRule,
  callRule,
  createRule,
} from '../core';

/**
 * @description Выполняет переданные правила аналогично оператору ||. Если одно из правил не завершилось ошибкой, то or вернет undefined
 * Если все переданные правила завершились с ошибкой, то вернется ошибка из последнего правила
 * @param rules - любые правила валдиаций
 * @example
 * ```ts
 *  const validate = or(number(), string(), array());
 *
 *  // undefined
 *  const result = validate('string');
 * ```
 */
export const or = <TLastSchemaValues extends Record<string, unknown>>(
  ...rules: ValidationRule<unknown, TLastSchemaValues>[]
) =>
  createRule<unknown, TLastSchemaValues>((value, ctx) => {
    let result: ValidationResult;

    rules.some((rule) => {
      result = callRule(rule, value, ctx);

      return result ? false : true;
    });

    return result;
  });
