import { createErrorCode, createSimpleError } from '../errors';

import { composeAsync } from './composeAsync';

describe('composeAsync', () => {
  it('Выполняет асинхронные правила слева направо', async () => {
    const validate = composeAsync(
      async () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error1',
        }),
      async () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error2',
        }),
    );

    const result = await validate(null);

    expect(result?.message).toBe('error1');
  });

  it('Поддерживаем вложенность правил', async () => {
    const validate = composeAsync(
      async () => undefined,
      async () => async () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error2',
        }),
    );

    const result = await validate(null);

    expect(result?.message).toBe('error2');
  });

  it('Поддерживается вложенность', async () => {
    const composed1 = composeAsync(
      async () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error1',
        }),
      async () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error1',
        }),
    );
    const validate = composeAsync(() => undefined, composed1);

    const result = await validate(null);

    expect(result?.message).toBe('error1');
  });
});
