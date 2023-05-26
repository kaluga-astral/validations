import { ValidationResult } from '../core';
import { PlainValidationResult, toPlainError } from '../toPlainError';

/**
 * @description Преобразует ошибку валидации в формат для вывода (например, в консоль)
 * @param validationResult
 * @example
 * ```ts
 *
 * type ListItem = { description: string };
 *
 * type Values = {
 *   info: { name: string };
 *   list: ListItem[];
 * };
 *
 * const validate = object<Values>({
 *   info: object<Values['info']>({ name: string() }),
 *   list: array(
 *     arrayItem(
 *       object<ListItem>({
 *         description: string(),
 *       }),
 *     ),
 *   ),
 * });
 *
 * const error = validate({
 *   info: { name: 22 },
 *   list: [{}],
 * });
 *
 * // {
 * //   info: { name: 'Не является строкой' },
 * //   list: [{ description: 'Обязательно' }],
 * // }
 * toPrettyError(error);
 * ```
 */
export const toPrettyError = (
  validationResult: ValidationResult,
): PlainValidationResult<string> =>
  toPlainError<string>(validationResult, (err) => err.message);
