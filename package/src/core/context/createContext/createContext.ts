import { ValidationContext } from '../types';
import { createSimpleError } from '../../errors';
import { ValidationTypes } from '../../types';

/**
 * @description Создает context валидации. Используется внутри фабрик guard и rule
 * При создании нового контекста устанавливает isOptional в false для того, чтобы по-дефолту все правило были required
 * Если контекст уже был создан, то сбрасывает isOptional в false для того, чтобы isOptional не стал сквозным
 */
export function createContext<Value extends ValidationTypes>(
  prevCtx: ValidationContext<Value> | undefined,
  value: Value,
): ValidationContext<Value>;

export function createContext<Value extends ValidationTypes, Values>(
  prevCtx: ValidationContext<Values> | undefined,
  value: Value,
): ValidationContext<Values>;

export function createContext<Value extends ValidationTypes, Values>(
  prevCtx: ValidationContext<Values> | undefined,
  value: Value,
): ValidationContext<Values | Value> {
  if (prevCtx) {
    return { ...prevCtx, isOptional: false };
  }

  return {
    global: { values: value },
    isOptional: false,
    createError: createSimpleError,
  };
}
