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
      isOptional: false,
    };

    const resultCtx = createContext(ctx, '');

    expect(ctx).toEqual(resultCtx);
  });

  it('По-дефолту выключает partial для объектов', () => {
    const resultCtx = createContext(undefined, '');

    expect(resultCtx.global.overrides.objectIsPartial).toBeFalsy();
  });

  it('Устанавливает текущее value в ctx.global.values', () => {
    const resultCtx = createContext(undefined, 'value');

    expect(resultCtx.global.values).toBe('value');
  });

  it('Устанавливает lastSchemaValue в контекст при явной передаче lastSchemaValue', () => {
    const resultCtx = createContext(undefined, 'globalValue', {
      lastSchemaValue: {
        field: 'name',
      },
    });

    expect(resultCtx.values).toEqual({ field: 'name' });
  });

  it('Перетирает lastSchemaValue, если был передан параметр', () => {
    const resultCtx = createContext(
      createContext(undefined, 'value1', { lastSchemaValue: { field: 1 } }),
      'value2',
      { lastSchemaValue: { field: 2 } },
    );

    expect(resultCtx.values).toEqual({ field: 2 });
  });

  it('Сохраняет предыдущий lastSchemaValue, если при вызове не было нового lastSchemaValue', () => {
    const prevCtx = createContext(undefined, 'value1', {
      lastSchemaValue: { field: 1 },
    });

    const currentCtx = createContext(prevCtx, 'value');

    expect(currentCtx.values).toEqual({ field: 1 });
  });

  it('В контексте доступна фабрика для создания SimpleError валидации', () => {
    const ctx = createContext(undefined, 'value');

    const error = ctx.createError({
      code: createErrorCode('error'),
      message: 'error',
    });

    expect(error instanceof ValidationSimpleError).toBeTruthy();
  });

  it('Наследует isOptional из предыдущего контекста', () => {
    const ctx = {
      global: {
        values: undefined,
        overrides: { objectIsPartial: true },
      },
      createError: createSimpleError,
      isOptional: true,
    };

    const resultCtx = createContext(ctx, '');

    expect(resultCtx.isOptional).toBe(ctx.isOptional);
  });

  it('params.isOptional устанавливает значение в контекст', () => {
    const ctx = {
      global: {
        values: undefined,
        overrides: { objectIsPartial: true },
      },
      createError: createSimpleError,
      isOptional: true,
    };

    const resultCtx = createContext(ctx, '', { isOptional: false });

    expect(resultCtx.isOptional).toBeFalsy();
  });
});
