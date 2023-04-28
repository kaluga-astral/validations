import { createSimpleError } from '../errors';

/**
 * @description Контекст, который доступен в каждом правиле
 */
export type ValidationContext<TValues> = Readonly<{
  /**
   * @description Глобальные значения, идущие от самого верхнего правила к самому нижнему
   */
  global: Readonly<{
    /**
     * @description Значения, которые валидируется guard самого высоко порядка
     */
    values: TValues;
    /**
     * @description Глобальные переопределения (сквозные для всех правил)
     */
    overrides: Readonly<{
      /**
       * @description Делает для всех объектов в схеме все свойства необязательными
       */
      objectIsPartial: boolean;
    }>;
  }>;
  /**
   * @description Фабрика ошибок. Возвращает новую ошибку валидации
   */
  createError: typeof createSimpleError;
}>;
