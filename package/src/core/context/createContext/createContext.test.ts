import { createErrorCode, createSimpleError } from '../../errors';

import { createContext } from './createContext';

describe('createContext', () => {
  it('Возвращает старый контекст', () => {
    const ctx = {
      global: {
        values: undefined,
        overrides: { objectIsPartial: true },
      },
      createError: createSimpleError,
    };

    const resultCtx = createContext(ctx, '');

    // ссылки равны
    expect(ctx === resultCtx).toBeTruthy();
  });

  it('global.overrides.objectIsPartial: при создании контекста устанавливается в false', () => {
    const resultCtx = createContext(undefined, '');

    expect(resultCtx.global.overrides.objectIsPartial).toBeFalsy();
  });

  it('При создании контекста в values устанавливается value', () => {
    const resultCtx = createContext(undefined, 'value');

    expect(resultCtx.global.values).toBe('value');
  });

  it('В контексте доступна фабрика для создания SimpleError валидации', () => {
    const ctx = createContext(undefined, 'value');

    const error = ctx.createError({
      code: createErrorCode('error'),
      message: 'error',
    });

    expect(error).toEqual({ code: createErrorCode('error'), message: 'error' });
  });
});
