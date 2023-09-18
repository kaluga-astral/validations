import { expect } from 'vitest';

import { objectAsync } from '../../object';
import { stringAsync } from '../../string';
import { createErrorCode } from '../../core';

import { optionalAsync } from './optionalAsync';

describe('optionalAsync', () => {
  it('Делает проверку в objectAsync() необязательной', async () => {
    const validate = optionalAsync(objectAsync<{}>({}));

    const result = await validate(undefined);

    expect(result).toBeUndefined();
  });

  it('Делает проверку в stringAsync() необязательной', async () => {
    const validate = optionalAsync(
      stringAsync(async (val, ctx) => {
        if (val === 'error trigger') {
          return ctx.createError({
            message: 'error triggered',
            code: createErrorCode('error'),
          });
        } else {
          return undefined;
        }
      }),
    );

    const result = await validate(undefined);
    const resultWithError = await validate('error trigger');

    expect(result).toBeUndefined();
    expect(resultWithError?.message).toBe('error triggered');
  });
});
