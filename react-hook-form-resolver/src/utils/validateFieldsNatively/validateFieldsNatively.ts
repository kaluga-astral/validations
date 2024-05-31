// Скопировано из https://github.com/react-hook-form/resolvers/blob/master/src/validateFieldsNatively.ts
// Причина копирования: в @hookform/resolvers react-hook-form указан как peerDep с крышкой. Из-за этого происходит рассинхрон с @astral/form
import {
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Ref,
  type ResolverOptions,
  get,
} from 'react-hook-form';

const setCustomValidity = (
  ref: Ref,
  fieldPath: string,
  errors: FieldErrors,
) => {
  if (ref && 'reportValidity' in ref) {
    const error = get(errors, fieldPath) as FieldError | undefined;

    ref.setCustomValidity((error && error.message) || '');
    ref.reportValidity();
  }
};

/**
 * Native validation (web only)
 */
export const validateFieldsNatively = <TFieldValues extends FieldValues>(
  errors: FieldErrors,
  options: ResolverOptions<TFieldValues>,
): void => {
  for (const fieldPath in options.fields) {
    const field = options.fields[fieldPath];

    if (field && field.ref && 'reportValidity' in field.ref) {
      setCustomValidity(field.ref, fieldPath, errors);
    } else if (field.refs) {
      field.refs.forEach((ref: HTMLInputElement) =>
        setCustomValidity(ref, fieldPath, errors),
      );
    }
  }
};
