# @astral/validations-react-hook-form-resolver

Пакет позволяет произвести интеграцию [@astral/validations]() и [react-hook-form](https://react-hook-form.com).

# Installation

```shell
npm i --save @astral/validations @astral/validations-react-hook-form-resolver react-hook-form
```

```shell
yarn add @astral/validations @astral/validations-react-hook-form-resolver react-hook-form
```

# Basic usage

### [Codesandbox](https://codesandbox.io/s/astral-validations-react-hook-form-tnq4of?file=/src/Form.tsx)

```tsx
import { object, string, optional } from '@astral/validations';
import { resolver } from '@astral/validations-react-hook-form-resolver';
import { useForm } from 'react-hook-form';

type Values = {
    name: string;
    info: { description?: string }
};

const validationSchema = object<Values>({
  name: string(),
  info: object<Values['info']>({
    description: optional(string()),
  }),
});

const Form = () => {
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: resolver<Values>(validationSchema),
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <input {...register('name')} />
      {formState.errors.name && (
        <p>{formState.errors.name.message}</p>
      )}
      <input {...register('info.description')} />
      {formState.errors.info?.description && (
        <p>{formState.errors.info.description.message}</p>
      )}
      <button type="submit">submit</button>
    </form>
  );
};
```

# With useFieldArray

```tsx
import { object, string, optional } from '@astral/validations';
import { resolver } from '@astral/validations-react-hook-form-resolver';
import { useForm } from 'react-hook-form';


type ListItemValue = { name: string };
type Values = { list: Array<ListItemValue> };

const validationSchema = object<Values>({
  list: array(
    arrayItem(
      object<ListItemValue>({
        name: string()
      })
    )
  ),
});

const TestForm = () => {
  const { register, handleSubmit, formState, control } = useForm<Values>({
    resolver: resolver<Values>(validationSchema),
  });
  const { fields } = useFieldArray<Values>({ control, name: 'list' });
  
  return (
    <form onSubmit={handleSubmit(() => {})}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`list.${index}.name`)} />
          <p>{formState.errors.list?.[index]?.name?.message}</p>
        </div>
      ))}
      <button type="submit">submit</button>
    </form>
  );
};
```

# Переиспользуемый useForm

```tsx
import { ObjectGuard, object, optional, string } from '@astral/validations';
import { resolver } from '@astral/validations-react-hook-form-resolver';
import {
  FieldValues,
  UseFormReturn,
  UseFormProps as UseReactHookFormProps,
  useForm as useReactHookForm,
} from 'react-hook-form';

type UseFormProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  UseReactHookFormProps<TFieldValues>,
  'resolver'
> & {
  validationSchema?: ObjectGuard<TFieldValues, TFieldValues>;
};

const useForm = <TFieldValues extends FieldValues = FieldValues>({
  validationSchema,
  defaultValues,
  ...params
}: UseFormProps<TFieldValues>): UseFormReturn<TFieldValues> =>
  useReactHookForm<TFieldValues>({
    ...params,
    defaultValues,
    resolver: validationSchema && resolver(validationSchema),
  });

type Values = {
  name: string;
  info: { description?: string };
};

const validationSchema = object<Values>({
  name: string(),
  info: object<Values['info']>({
    description: optional(string()),
  }),
});

const Form = () => {
  const { register, handleSubmit, formState } = useForm<Values>({
    validationSchema,
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <input {...register('name')} />
      {formState.errors.name && <p>{formState.errors.name.message}</p>}
      <input {...register('info.description')} />
      {formState.errors.info?.description && (
        <p>{formState.errors.info.description.message}</p>
      )}
      <button type="submit">submit</button>
    </form>
  );
};
```
