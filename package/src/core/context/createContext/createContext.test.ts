import {
  ValidationSimpleError,
  createErrorCode,
  createSimpleError,
} from '../../errors';

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

    expect(ctx).toEqual(resultCtx);
  });

  it('global.overrides.objectIsPartial: при создании контекста устанавливается в false', () => {
    const resultCtx = createContext(undefined, '');

    expect(resultCtx.global.overrides.objectIsPartial).toBeFalsy();
  });

  it('При создании контекста в global.values устанавливается value', () => {
    const resultCtx = createContext(undefined, 'value');

    expect(resultCtx.global.values).toBe('value');
  });

  it('При передаче lastSchemaValue значение устанавливается в контекст', () => {
    const resultCtx = createContext(undefined, 'globalValue', {
      field: 'name',
    });

    expect(resultCtx.lastSchemaValue).toEqual({ field: 'name' });
  });

  it('lastSchemaValue перетирается, если был передан параметр', () => {
    const resultCtx = createContext(
      createContext(undefined, 'globalValue1', { field: 1 }),
      'globalValue2',
      {
        field: 2,
      },
    );

    expect(resultCtx.lastSchemaValue).toEqual({ field: 2 });
  });

  it('В контексте доступна фабрика для создания SimpleError валидации', () => {
    const ctx = createContext(undefined, 'value');

    const error = ctx.createError({
      code: createErrorCode('error'),
      message: 'error',
    });

    expect(error instanceof ValidationSimpleError).toBeTruthy();
  });
});
