import {
  STRING_TYPE_ERROR_INFO,
  Schema,
  array,
  arrayItem,
  object,
  string,
} from '@astral/revizor';
import { Ref, ResolverOptions } from 'react-hook-form';
import { expect } from 'vitest';

import { revizorResolver } from './resolver';

describe('revizorResolver', () => {
  it('Формирует ошибку, требуемую для rhf', () => {
    const nameFieldRef = {} as Ref;

    type ArrayValue = { name: string };
    type Values = { info: { array: Array<ArrayValue> } };

    const schema: Schema<Values> = {
      info: object<Values['info']>({
        array: array(arrayItem(object<ArrayValue>({ name: string() }))),
      }),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any = { info: { array: [{ name: 22 }] } };

    const rhfOptions: ResolverOptions<Values> = {
      fields: {
        'info.array.0.name': { name: 'name', ref: nameFieldRef },
      },
      shouldUseNativeValidation: false,
    };

    const result = revizorResolver<Values>(schema)(values, {}, rhfOptions);

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
});
