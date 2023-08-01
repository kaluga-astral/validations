import { ValidationResult, ValidationRule, createRule } from '../core';

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
export const or = <TLastSchemфValues extends Record<string, unknown>>(
  ...rules: ValidationRule<unknown, TLastSchemфValues>[]
) =>
  createRule<unknown, TLastSchemфValues>((value, ctx) => {
    let result: ValidationResult;

    rules.some((rule) => {
      result = rule(value, ctx);

      return result ? false : true;
    });

    return result;
  });
