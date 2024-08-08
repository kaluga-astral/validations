import { type DeepPartial } from 'utility-types';

import { type ValidationContext } from '../types';
import { createSimpleError } from '../../errors';
import { type ValidationTypes } from '../../types';

type Params<TLastSchemaValues extends Record<string, unknown>> = {
  /**
   * Value последнего валидируемого объекта
   */
  lastSchemaValue?: DeepPartial<TLastSchemaValues>;
  /**
   * Позволяет создать ctx, в котором будет соответсвующий isOptional
   */
  isOptional?: boolean;
};

/**
 * Создает context валидации. Используется внутри фабрик guard и rule
 * @default по-дефолту сбрасывает все флаги в false
 */
export function createContext<
  TValue extends ValidationTypes,
  TLastSchemaValues extends Record<string, unknown> = {},
>(
  prevCtx: ValidationContext<Record<string, unknown>> | undefined,
  value: TValue,
  { lastSchemaValue, isOptional }: Params<TLastSchemaValues> = {},
): ValidationContext<TLastSchemaValues> {
  if (prevCtx) {
    return {
      ...prevCtx,
      isOptional: isOptional ?? prevCtx.isOptional,
      values:
        lastSchemaValue || (prevCtx.values as DeepPartial<TLastSchemaValues>),
    };
  }

  return {
    values: lastSchemaValue,
    global: {
      values: value,
      overrides: {
        objectIsPartial: false,
      },
    },
    isOptional: isOptional ?? false,
    createError: createSimpleError,
  };
}
