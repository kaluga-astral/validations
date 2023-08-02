import { DeepPartial, DeepReadonly } from 'utility-types';

import { createSimpleError } from '../errors';

/**
 * @description Контекст, который доступен в каждом правиле
 */
export type ValidationContext<
  TLastSchemaValues extends Record<string, unknown> = {},
  TGlobalSchemaValues = unknown,
> = DeepReadonly<{
  /**
   * @description Values последнего валидируемого object
   */
  values?: DeepPartial<TLastSchemaValues>;
  /**
   * @description Глобальные значения, идущие от самого верхнего правила к самому нижнему
   */
  global: {
    /**
     * @description Значения, которые валидируется guard самого высоко порядка
     */
    values: TGlobalSchemaValues;
    /**
     * @description Глобальные переопределения (сквозные для всех правил)
     */
    overrides: {
      /**
       * @description Делает для всех объектов в схеме все свойства необязательными
       */
      objectIsPartial: boolean;
    };
  };
  /**
   * @description Фабрика ошибок. Возвращает новую ошибку валидации
   */
  createError: typeof createSimpleError;
}>;
