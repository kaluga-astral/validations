import { ValidationResult, ValidationTypes } from '../../types';
import { required } from '../../rule';
import { ValidationContext, createContext } from '../../context';
import { compose } from '../../compose';

type DefOptions = {
  /**
   * @description Переопределяет дефолтное сообщения ошибки для required
   * @example string.define({ requiredMessage: 'ИНН не может быть пустым' })(inn())
   */
  requiredErrorMessage?: string;
  /**
   * @description Переопределяет сообщение об ошибке типа
   * @example string.define({ typeErrorMessage: 'ИНН не может быть числом' })(inn())
   */
  typeErrorMessage?: string;
};

type GuardValue<ValidationType> = ValidationType | undefined | null | unknown;

/**
 * @description Интерфейс функции guard, которая в прототипе содержит метод define
 */
export interface Guard<ValidationType extends ValidationTypes, TValues> {
  (
    value: GuardValue<ValidationType>,
    ctx?: ValidationContext<TValues>,
  ): ValidationResult;
  /**
   * @description Функция для создания нового guard с переопределенными дефолтными параметрами. Возвращает новый guard
   * @param options - параметры, позволяющие переопределить дефолтные настройки guard
   * @example string.define({ requiredMessage: 'ИНН не может быть пустым' })(inn())
   */
  define(options: DefOptions): Guard<ValidationType, TValues>;
}

/**
 * @description Функция, которая позволяет определять частную логику для guard
 */
type GuardExecutor<TValues> = (
  value: unknown,
  ctx: ValidationContext<TValues>,
  defOptions: DefOptions,
) => ValidationResult;

/**
 * @description Создает guard. Guard - функция, проверяющая тип значения
 * По-дефолту проверяет value на required. Для выключения required необходимо использовать optional().
 * После первого вызова guard в прототипу функции становится доступен метод define, который позволяет переопределить дефолтное поведение guard (например, изменить текст для required правила)
 * @example
 * ```ts
 * const string = <TValues>(...rules: CompositionalValidationRule<string, TValues>[]) =>
 *   createGuard<string, TValues>((value, ctx) => {
 *     if (typeof value !== 'string') {
 *       return ctx.createError({ code: Symbol(), message: 'Не строка' });
 *     }
 *
 *     return compose<string, TValues>(...rules)(value, ctx);
 *   });
 * ```
 */
export const createGuard = <ValidationType extends ValidationTypes, TValues>(
  executeGuard: GuardExecutor<TValues>,
): Guard<ValidationType, TValues> => {
  // выделено в отдельную именованную функцию для того, чтобы ее можно было рекурсивно вызывать в define
  const createInnerGuard = (
    defOptions: DefOptions = {},
  ): Guard<ValidationType, TValues> => {
    const guard: Guard<ValidationType, TValues> = (value, ctx) => {
      // контекст создается, если он не был создан раннее
      const currentCtx = createContext<ValidationType, TValues>(
        ctx,
        // при создании контекста сейчас не имеет значение какого типа будет ctx.values
        value as ValidationType,
      );

      // делает guard required, если в контексте isOptional false. Контекст модифицируется вышестоящими правилами
      if (!currentCtx.isOptional) {
        return compose<unknown, TValues>(
          // возможность переопределить дефолтный message для required
          required({ message: defOptions.requiredErrorMessage }),
          (interValue, interCtx) =>
            executeGuard(
              interValue,
              interCtx as ValidationContext<TValues>,
              defOptions,
            ),
        )(value, currentCtx);
      }

      return executeGuard(value, currentCtx, defOptions);
    };

    guard.define = (overridesDefOptions) =>
      createInnerGuard(overridesDefOptions);

    return guard;
  };

  return createInnerGuard();
};
