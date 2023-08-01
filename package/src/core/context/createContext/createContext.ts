import { ValidationContext } from '../types';
import { createSimpleError } from '../../errors';
import { ValidationTypes } from '../../types';

/**
 * @description Создает context валидации. Используется внутри фабрик guard и rule
 * @default по-дефолту сбрасывает все флаги в false
 */
export function createContext<TValue extends ValidationTypes>(
  prevCtx: ValidationContext<{}, TValue> | undefined,
  value: TValue,
): ValidationContext<{}, TValue>;

export function createContext<
  TValue extends ValidationTypes,
  TLastSchemaValues extends Record<string, unknown>,
>(
  prevCtx: ValidationContext<{}> | undefined,
  value: TValue,
  lastSchemaValue: TLastSchemaValues,
): ValidationContext<TLastSchemaValues, TValue>;

export function createContext<
  TValue extends ValidationTypes,
  TLastSchemaValues extends Record<string, unknown>,
>(
  prevCtx: ValidationContext<TLastSchemaValues> | undefined,
  value: TValue,
  lastSchemaValue?: TLastSchemaValues,
): ValidationContext<{}, unknown> {
  if (prevCtx && !lastSchemaValue) {
    return prevCtx;
  }

  const currentLastSchemaValue = lastSchemaValue ? lastSchemaValue : undefined;

  if (prevCtx) {
    return { ...prevCtx, values: currentLastSchemaValue };
  }

  return {
    values: currentLastSchemaValue,
    global: {
      values: value,
      overrides: {
        objectIsPartial: false,
      },
    },
    createError: createSimpleError,
  };
}
