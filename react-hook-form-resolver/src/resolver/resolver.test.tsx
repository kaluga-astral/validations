import {
  REQUIRED_ERROR_INFO,
  STRING_TYPE_ERROR_INFO,
  array,
  arrayItem,
  object,
  string,
} from '@astral/validations';
import { Ref, ResolverOptions, useFieldArray, useForm } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { resolver } from './resolver';

describe('resolver', () => {
  it('Формирует ошибку, требуемую для rhf', () => {
    const nameFieldRef = {} as Ref;

    type ArrayValue = { name: string };
    type Values = { info: { array: Array<ArrayValue> } };

    const validationSchema = object<Values>({
      info: object<Values['info']>({
        array: array(arrayItem(object<ArrayValue>({ name: string() }))),
      }),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any = { info: { array: [{ name: 22 }] } };

    const rhfOptions: ResolverOptions<Values> = {
      fields: {
        'info.array.0.name': { name: 'name', ref: nameFieldRef },
      },
      shouldUseNativeValidation: false,
    };

    const result = resolver<Values>(validationSchema)(values, {}, rhfOptions);

    const expectedResult = {
      values: {},
      errors: {
        info: {
          array: [
            {
              name: {
                message: STRING_TYPE_ERROR_INFO.message,
                type: STRING_TYPE_ERROR_INFO.code,
                ref: nameFieldRef,
              },
            },
          ],
        },
      },
    };

    expect(result).toEqual(expectedResult);
  });

  it('После submit в форму попадают ошибки для объектов', async () => {
    type Values = { info: { name: string } };

    const validationSchema = object<Values>({
      info: object<Values['info']>({
        name: string(),
      }),
    });

    const TestForm = () => {
      const { register, handleSubmit, formState } = useForm<Values>({
        resolver: resolver<Values>(validationSchema),
      });

      return (
        <form onSubmit={handleSubmit(() => {})}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <input {...register('info.name')} />
          {formState.errors.info?.name && (
            <>
              <p>{formState.errors.info.name.message}</p>
              <p>{formState.errors.info.name.type}</p>
            </>
          )}
          <button type="submit">submit</button>
        </form>
      );
    };

    render(<TestForm />);
    fireEvent.submit(screen.getByText('submit'));

    await waitFor(() => {
      const errorText = screen.getByText(REQUIRED_ERROR_INFO.message);
      const errorType = screen.getByText(REQUIRED_ERROR_INFO.code);

      expect(errorText).toBeVisible();
      expect(errorType).toBeVisible();
    });
  });

  it('useFieldArray: после submit в форму попадают ошибки', async () => {
    type ListItemValue = { name: string };
    type Values = { list: Array<ListItemValue> };

    const validationSchema = object<Values>({
      list: array(arrayItem(object<ListItemValue>({ name: string() }))),
    });

    const TestForm = () => {
      const { register, handleSubmit, formState, control } = useForm<Values>({
        resolver: resolver<Values>(validationSchema),
        defaultValues: { list: [{ name: '' }] },
      });
      const { fields } = useFieldArray<Values>({ control, name: 'list' });

      return (
        <form onSubmit={handleSubmit(() => {})}>
          {fields.map((field, index) => (
            <div key={field.id}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <input {...register(`list.${index}.name`)} />
              <p>{formState.errors.list?.[index]?.name?.message}</p>
              <p>{formState.errors.list?.[index]?.name?.type}</p>
            </div>
          ))}
          <button type="submit">submit</button>
        </form>
      );
    };

    render(<TestForm />);
    fireEvent.submit(screen.getByText('submit'));

    await waitFor(() => {
      const errorText = screen.getByText(REQUIRED_ERROR_INFO.message);
      const errorType = screen.getByText(REQUIRED_ERROR_INFO.code);

      expect(errorText).toBeVisible();
      expect(errorType).toBeVisible();
    });
  });
});
