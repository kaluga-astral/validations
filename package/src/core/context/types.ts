import { type DeepPartial, type DeepReadonly } from 'utility-types';

import { type createSimpleError } from '../errors';

/**
 * Контекст, который доступен в каждом правиле
 */
export type ValidationContext<
  TLastSchemaValues extends Record<string, unknown> = {},
  TGlobalSchemaValues = unknown,
> = DeepReadonly<{
  /**
   * Values последнего валидируемого object
   */
  values?: DeepPartial<TLastSchemaValues>;
  /**
   * Глобальные значения, идущие от самого верхнего правила к самому нижнему
   */
  global: DeepReadonly<{
    /**
     * Значения, которые валидируется guard самого высоко порядка
     */
    values: TGlobalSchemaValues;
    /**
     * Глобальные переопределения (сквозные для всех правил)
     */
    overrides: {
      /**
       * Делает для всех объектов в схеме все свойства необязательными
       */
      objectIsPartial: boolean;
    };
  }>;
  /**
   * Фабрика ошибок. Возвращает новую ошибку валидации
   */
  createError: typeof createSimpleError;
  /**
   * Флаг, позволяющий отключать в guard'ах required правило. Первый guard, который примет isOptional===true сбросит его
   */
  isOptional: boolean;
}>;
