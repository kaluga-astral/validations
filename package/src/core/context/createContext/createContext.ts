import { DeepPartial } from 'utility-types';

import { ValidationContext } from '../types';
import { createSimpleError } from '../../errors';
import { ValidationTypes } from '../../types';

/**
 * @description Создает context валидации. Используется внутри фабрик guard и rule
 * @default по-дефолту сбрасывает все флаги в false
 */
export function createContext<
  TValue extends ValidationTypes,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  prevCtx: ValidationContext<Record<string, unknown>> | undefined,
  value: TValue,
  lastSchemaValue?: DeepPartial<TLastSchemaValues>,
): ValidationContext<TLastSchemaValues> {
  if (prevCtx && !lastSchemaValue) {
    return prevCtx as ValidationContext<TLastSchemaValues>;
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
    isOptional: false,
    createError: createSimpleError,
  };
}
