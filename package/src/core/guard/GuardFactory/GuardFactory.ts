import { GuardDefOptions, GuardValue } from '../types';
import { required } from '../../rule';
import { ValidationContext, createContext } from '../../context';
import { ValidationResult } from '../../types';

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
//
// export abstract class GuardFactory<
//   AddDefOptions extends Record<string, unknown> = {},
// > {
//   abstract createSync<
//     TLastSchemaValues extends Record<string, unknown>,
//   >(): Guard<TLastSchemaValues, AddDefOptions>;
//
//   abstract createAsync<
//     TLastSchemaValues extends Record<string, unknown>,
//   >(): AsyncGuard<TLastSchemaValues, AddDefOptions>;
//
//   private executeGuard<TLastSchemaValues extends Record<string, unknown>>(
//     executor: GuardExecutor<AddDefOptions>,
//   ): Guard<TLastSchemaValues, AddDefOptions>;
//   private executeGuard<TLastSchemaValues extends Record<string, unknown>>(
//     executor: AsyncGuardExecutor<AddDefOptions>,
//   ): AsyncGuard<TLastSchemaValues, AddDefOptions>;
//
//   private executeGuard<TLastSchemaValues extends Record<string, unknown>>(
//     executor: GuardExecutor<AddDefOptions> | AsyncGuardExecutor<AddDefOptions>,
//   ) {
//     // выделено в отдельную именованную функцию для того, чтобы ее можно было рекурсивно вызывать в define
//     const createInnerGuard = (
//       defOptions: GuardDefOptions<AddDefOptions> = {},
//     ) => {
//       const guard = (
//         value: unknown,
//         prevCtx?: ValidationContext<TLastSchemaValues>,
//       ) => {
//         const ctx = createContext<unknown>(
//           prevCtx,
//           // при создании контекста сейчас не имеет значение какого типа будет ctx.values
//           value,
//         );
//
//         const requiredResult = required({
//           message: defOptions?.requiredErrorMessage,
//         })(value, ctx);
//
//         if (defOptions?.isOptional && requiredResult) {
//           return undefined;
//         }
//
//         return requiredResult || executor(value, ctx, defOptions);
//       };
//
//       guard.define = (overridesDefOptions: GuardDefOptions<AddDefOptions>) =>
//         createInnerGuard(overridesDefOptions);
//
//       return guard;
//     };
//
//     return createInnerGuard();
//   }
//
//   protected createSyncGuard = <
//     TLastSchemaValues extends Record<string, unknown>,
//   >(
//     executor: GuardExecutor<AddDefOptions>,
//   ): Guard<TLastSchemaValues, AddDefOptions> => this.executeGuard(executor);
//
//   protected createAsyncGuard = <
//     TLastSchemaValues extends Record<string, unknown>,
//   >(
//     executor: GuardExecutor<AddDefOptions>,
//   ): Guard<TLastSchemaValues, AddDefOptions> => this.executeGuard(executor);
// }

export function createGuard<
  TLastSchemaValues extends Record<string, unknown>,
  AddDefOptions extends Record<string, unknown>,
>(
  executor: GuardExecutor<AddDefOptions>,
): Guard<TLastSchemaValues, AddDefOptions>;

export function createGuard<
  TLastSchemaValues extends Record<string, unknown>,
  AddDefOptions extends Record<string, unknown>,
>(
  executor: AsyncGuardExecutor<AddDefOptions>,
): AsyncGuard<TLastSchemaValues, AddDefOptions>;

export function createGuard<
  TLastSchemaValues extends Record<string, unknown>,
  AddDefOptions extends Record<string, unknown>,
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
