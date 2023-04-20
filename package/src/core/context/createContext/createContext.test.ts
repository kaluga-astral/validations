import { ValidationSimpleError, createSimpleError } from '../../errors';

import { createContext } from './createContext';

describe('createContext', () => {
  it('Копирует старый контекст', () => {
    const ctx = {
      global: {
        values: undefined,
      },
      isOptional: true,
      createError: createSimpleError,
    };

    const resultCtx = createContext(ctx, '');

    const expectedCtx = {
      global: {
        values: undefined,
      },
      isOptional: false,
      createError: createSimpleError,
    };

    expect(resultCtx).toEqual(expectedCtx);
  });

  it('При создании контекста устанавливает isOptional в false', () => {
    const resultCtx = createContext(undefined, '');

    expect(resultCtx.isOptional).toBeFalsy();
  });

  it('При создании контекста в values устанавливается value', () => {
    const resultCtx = createContext(undefined, 'value');

    expect(resultCtx.global.values).toBe('value');
  });

  it('В контексте доступна фабрика для создания SimpleError валидации', () => {
    const ctx = createContext(undefined, 'value');

    const error = ctx.createError({ code: Symbol(), message: 'error' });

    expect(error instanceof ValidationSimpleError).toBeTruthy();
  });

  it('При копировании контекста сбрасывает isOptional', () => {
    const ctx = {
      global: {
        values: undefined,
      },
      isOptional: true,
      createError: createSimpleError,
    };

    const resultCtx = createContext(ctx, '');

    expect(resultCtx.isOptional).toBeFalsy();
  });
});