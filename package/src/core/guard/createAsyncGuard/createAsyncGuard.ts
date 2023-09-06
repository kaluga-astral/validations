import { ValidationResult } from '../../types';
import { REQUIRED_ERROR_INFO, required } from '../../rule';
import { ValidationContext, createContext } from '../../context';
import { composeAsync } from '../../composeAsync';
import { GuardDefOptions, GuardValue } from '../types';

/**
 * @description Интерфейс асинхронной функции guard, которая в прототипе содержит метод define
 */
export interface AsyncGuard<
  TLastSchemaValues extends Record<string, unknown> = {},
  AddDefOptions extends Record<string, unknown> = {},
> {
  (
    value: GuardValue,
    ctx?: ValidationContext<TLastSchemaValues>,
  ): Promise<ValidationResult>;
  /**
   * @description Функция для создания нового guard с переопределенными дефолтными параметрами. Возвращает новый guard
   * @param options - параметры, позволяющие переопределить дефолтные настройки guard
   * @example string.define({ requiredMessage: 'ИНН не может быть пустым' })(inn())
   */
  define(
    options: GuardDefOptions<AddDefOptions>,
  ): AsyncGuard<TLastSchemaValues, AddDefOptions>;
}

/**
 * @description Функция, которая позволяет определять частную логику для guard
 */
type AsyncGuardExecutor<AddDefOptions extends Record<string, unknown>> = (
  value: unknown,
  ctx: ValidationContext<Record<string, unknown>>,
  defOptions: GuardDefOptions<AddDefOptions>,
) => Promise<ValidationResult>;

/**
 * @description Создает guard. Guard - функция, проверяющая тип значения
 * По-дефолту проверяет value на required. Для выключения required необходимо использовать optional().
 * После первого вызова guard в прототипу функции становится доступен метод define, который позволяет переопределить дефолтное поведение guard (например, изменить текст для required правила)
 * @example
 * ```ts
 * const string = <TLastSchemaValues extends Record<string, unknown>>(...rules: ValidationRule<string, TValues>[]) =>
 *   createGuard<string, TValues>((value, ctx) => {
 *     if (typeof value !== 'string') {
 *       return ctx.createError({ code: 'custom error', message: 'Не строка' });
 *     }
 *
 *     return compose<string, TValues>(...rules)(value, ctx);
 *   });
 * ```
 */
export const createAsyncGuard = <
  TLastSchemaValues extends Record<string, unknown>,
  AddDefOptions extends Record<string, unknown> = {},
>(
  executeGuard: AsyncGuardExecutor<AddDefOptions>,
) => {
  // выделено в отдельную именованную функцию для того, чтобы ее можно было рекурсивно вызывать в define
  const createInnerGuard = (
    defOptions: GuardDefOptions<AddDefOptions> = {},
  ) => {
    const guard = async (
      value: unknown,
      prevCtx?: ValidationContext<TLastSchemaValues>,
    ) => {
      const ctx = createContext<unknown>(
        prevCtx,
        // при создании контекста сейчас не имеет значение какого типа будет ctx.values
        value,
      );

      const validationResult = await composeAsync<unknown, TLastSchemaValues>(
        // возможность переопределить дефолтный message для required
        required({ message: defOptions?.requiredErrorMessage }),
        (interValue: unknown, interCtx: ValidationContext<TLastSchemaValues>) =>
          executeGuard(interValue, interCtx, defOptions),
      )(value, ctx as ValidationContext<TLastSchemaValues>);

      // если включен isOptional режим и required упал с ошибкой, то необходимо проигнорировать ошибку
      if (
        defOptions?.isOptional &&
        validationResult?.cause.code === REQUIRED_ERROR_INFO.code
      ) {
        return undefined;
      }

      return validationResult;
    };

    guard.define = (overridesDefOptions: GuardDefOptions<AddDefOptions>) =>
      createInnerGuard(overridesDefOptions);

    return guard;
  };

  return createInnerGuard();
};
