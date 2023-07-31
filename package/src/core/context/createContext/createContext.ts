import { ValidationContext } from '../types';
import { createSimpleError } from '../../errors';
import { ValidationTypes } from '../../types';

/**
 * @description Создает context валидации. Используется внутри фабрик guard и rule
 * @default по-дефолту сбрасывает все флаги в false
 */
export function createContext<Value extends ValidationTypes>(
  prevCtx: ValidationContext<{}, Value> | undefined,
  value: Value,
): ValidationContext<{}, Value>;

export function createContext<
  Value extends ValidationTypes,
  TLastSchemaValues extends Record<string, unknown>,
>(
  prevCtx: ValidationContext<{}> | undefined,
  value: Value,
  lastSchemaValue: TLastSchemaValues,
): ValidationContext<TLastSchemaValues, Value>;

export function createContext<
  Value extends ValidationTypes,
  TLastSchemaValues extends Record<string, unknown>,
>(
  prevCtx: ValidationContext<TLastSchemaValues> | undefined,
  value: Value,
  lastSchemaValue?: TLastSchemaValues,
): ValidationContext<{}, unknown> {
  if (prevCtx) {
    return {
      ...prevCtx,
      lastSchemaValue,
    };
  }

  return {
    lastSchemaValue,
    global: {
      values: value,
      overrides: {
        objectIsPartial: false,
      },
    },
    createError: createSimpleError,
  };
}
