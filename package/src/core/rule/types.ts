import { ValidationContext } from '../context';
import { ValidationResult } from '../types';

/**
 * @description Правило для валидации. Может содержать в прототипе meta информацию для advanced валидации
 */
export type ValidationRule<TValue, TValues> = (
  value: TValue,
  ctx?: ValidationContext<TValues>,
) => ValidationResult;

/**
 * @description Правило для валидации, которое прокидывается в композиционные правила или guard.
 * @param ctx - для композиционного правила ctx создается compose правилам более верхнего уровня, поэтому ctx здесь не optional
 */
export type CompositionalValidationRule<TValue, TValues> = (
  value: TValue,
  ctx: ValidationContext<TValues>,
) => ValidationResult;

/**
 * @description Композиционное правило валидации, умеющее работать с любыми значениями.
 * В основном используется для композиционных правил, которые принимают rule, умеющие валидировать разные значения (optional, transform...)
 */
export type UniversalCompositionalValidationRule<TValues = unknown> =
  CompositionalValidationRule<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    TValues
  >;
