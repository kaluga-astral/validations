import { createSimpleError } from '../errors';

/**
 * @description Контекст, который доступен в каждом правиле
 */
export type ValidationContext<TValues> = {
  /**
   * @description Глобальные значения, идущие от самого верхнего правила к самому нижнему
   */
  global: {
    /**
     * @description Значения, которые валидируется guard самого высоко порядка
     */
    values: TValues;
  };
  /**
   * @description Флаг, указывающий на то, что guard должен выключить проверку на required
   */
  isOptional: boolean;
  /**
   * @description Фабрика ошибок. Возвращает новую ошибку валидации
   */
  createError: typeof createSimpleError;
};
