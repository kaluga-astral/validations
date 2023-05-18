import { Guard, ValidationTypes } from '../core';
import { string } from '../string';

/**
 * @description Выключает проверку на required в guard
 * @param guard - правило, проверяющее тип значения
 * @example object({ name: optional(string(min(22))) })
 */
export const optional = <ValidationType extends ValidationTypes, TValues>(
  guard: Guard<ValidationType, TValues>,
) => guard.define({ isOptional: true });

const validateCustomString = string().define({
  typeErrorMessage: 'Только строка',
  requiredErrorMessage: 'Не может быть пустым',
});

// { message: 'Не может быть пустым' }
validateCustomString(undefined);
// { message: 'Только строка' }
validateCustomString(20);
