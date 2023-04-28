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
  /**
   * @description Позволяет выключчать проверку на required
   * @default false
   */
  isOptional?: boolean;
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
    const guard: Guard<ValidationType, TValues> = (value, prevCtx) => {
      const ctx = createContext<ValidationType, TValues>(
        prevCtx,
        // при создании контекста сейчас не имеет значение какого типа будет ctx.values
        value as ValidationType,
      );

      const { isOptional } = defOptions;

      // включает required правило, если не включен isOptional режим
      if (!isOptional) {
        return compose<unknown, TValues>(
          // возможность переопределить дефолтный message для required
          required({ message: defOptions.requiredErrorMessage }),
          (interValue: unknown, interCtx: ValidationContext<TValues>) =>
            executeGuard(interValue, interCtx, defOptions),
        )(value, ctx);
      }

      return executeGuard(value, ctx, defOptions);
    };

    guard.define = (overridesDefOptions) =>
      createInnerGuard(overridesDefOptions);

    return guard;
  };

  return createInnerGuard();
};
