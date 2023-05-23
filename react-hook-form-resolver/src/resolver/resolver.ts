import { object, toPlainError } from '@astral/validations';
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
  get,
} from 'react-hook-form';
import { validateFieldsNatively } from '@hookform/resolvers';

/**
 * @description Позволяет выполнять object валидацию для формы react-hook-form
 * @param validateBySchema
 * @example
 * ```tsx
 *      type Values = { info: { name: string } };
 *
 *     const validationSchema = object<Values>({
 *       info: object<Values['info']>({
 *         name: string(),
 *       }),
 *     });
 *
 *     const TestForm = () => {
 *       const { register, handleSubmit, formState } = useForm<Values>({
 *         resolver: resolver<Values>(validationSchema),
 *       });
 *
 *       return (
 *         <form onSubmit={handleSubmit(() => {})}>
 *           <input {...register('info.name')} />
 *           {formState.errors.info?.name && (
 *             <>
 *               <p>{formState.errors.info.name.message}</p>
 *               <p>{formState.errors.info.name.type}</p>
 *             </>
 *           )}
 *           <button type="submit">submit</button>
 *         </form>
 *       );
 *     };
 * ```
 */
export const resolver =
  <TFieldValues extends FieldValues = FieldValues>(
    validateBySchema: ReturnType<typeof object<TFieldValues>>,
  ): Resolver<TFieldValues> =>
  (values, _, options) => {
    const validationResult = validateBySchema(values);

    if (validationResult) {
      const resolverError = toPlainError<FieldError>(
        validationResult,
        (err, { path }) => {
          return {
            message: err.message,
            type: err.cause.code,
            ref: get(options.fields, path)?.ref,
          };
        },
      ) as FieldErrors<TFieldValues>;

      return { values: {}, errors: resolverError };
    }

    if (options.shouldUseNativeValidation) {
      validateFieldsNatively({}, options);
    }

    return { errors: {}, values };
  };
