import { ValidationResult } from '../../types';
import { required } from '../../rule';
import { ValidationContext, createContext } from '../../context';
import { GuardDefOptions, GuardValue } from '../types';

/**
 * @description Интерфейс функции guard, которая в прототипе содержит метод define
 */
export interface Guard<
  TLastSchemaValues extends Record<string, unknown> = {},
  AddDefOptions extends Record<string, unknown> = {},
> {
  (
    value: GuardValue,
    ctx?: ValidationContext<TLastSchemaValues>,
  ): ValidationResult;
  /**
   * @description Функция для создания нового guard с переопределенными дефолтными параметрами. Возвращает новый guard
   * @param options - параметры, позволяющие переопределить дефолтные настройки guard
   * @example string.define({ requiredMessage: 'ИНН не может быть пустым' })(inn())
   */
  define(
    options: GuardDefOptions<AddDefOptions>,
  ): Guard<TLastSchemaValues, AddDefOptions>;
}

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
type GuardExecutor<AddDefOptions extends Record<string, unknown>> = (
  value: unknown,
  ctx: ValidationContext<Record<string, unknown>>,
  defOptions: GuardDefOptions<AddDefOptions>,
) => ValidationResult;

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
export function createGuard<
  TLastSchemaValues extends Record<string, unknown>,
  AddDefOptions extends Record<string, unknown> = {},
>(
  executor: GuardExecutor<AddDefOptions>,
): Guard<TLastSchemaValues, AddDefOptions>;

export function createGuard<
  TLastSchemaValues extends Record<string, unknown>,
  AddDefOptions extends Record<string, unknown> = {},
>(
  executor: AsyncGuardExecutor<AddDefOptions>,
): AsyncGuard<TLastSchemaValues, AddDefOptions>;

export function createGuard<
  TLastSchemaValues extends Record<string, unknown>,
  AddDefOptions extends Record<string, unknown> = {},
>(executor: GuardExecutor<AddDefOptions> | AsyncGuardExecutor<AddDefOptions>) {
  // выделено в отдельную именованную функцию для того, чтобы ее можно было рекурсивно вызывать в define
  const createInnerGuard = (
    defOptions: GuardDefOptions<AddDefOptions> = {},
  ) => {
    const guard = (
      value: unknown,
      prevCtx?: ValidationContext<TLastSchemaValues>,
    ) => {
      const ctx = createContext<unknown>(
        prevCtx,
        // при создании контекста сейчас не имеет значение какого типа будет ctx.values
        value,
      );

      const requiredResult = required({
        message: defOptions?.requiredErrorMessage,
      })(value, ctx);

      if (defOptions?.isOptional && requiredResult) {
        return undefined;
      }

      return requiredResult || executor(value, ctx, defOptions);
    };

    guard.define = (overridesDefOptions: GuardDefOptions<AddDefOptions>) =>
      createInnerGuard(overridesDefOptions);

    return guard;
  };

  return createInnerGuard();
}
