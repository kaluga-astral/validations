import { REQUIRED_ERROR_INFO } from '../../rule';

import { createGuard } from './createGuard';

describe('createGuard', () => {
  it('Создает guard, который возвращает ошибку', () => {
    const errorCode = Symbol();

    const guard = createGuard<string, string>((_, ctx) => {
      return ctx.createError({ message: 'myerror', code: errorCode });
    });

    const error = guard('value');

    expect(error?.message).toBe('myerror');
    expect(error?.cause.code).toBe(errorCode);
  });

  it('По-дефолту проверяет правило на required', () => {
    const guard = createGuard<string, string>(() => undefined);

    const error = guard(undefined);

    expect(error?.cause.code).toBe(REQUIRED_ERROR_INFO.code);
  });

  it('guard.define: создает копию guard', () => {
    const guard = createGuard<string, string>(() => undefined);

    const error = guard.define({})('value');

    expect(error).toBeUndefined();
  });

  it('guard.define:requiredErrorMessage: переопределяет message для required', () => {
    const guard = createGuard<string, string>(() => undefined);

    const error = guard.define({ requiredErrorMessage: 'custom message' })(
      undefined,
    );

    expect(error?.message).toBe('custom message');
  });

  it('guard.define:isOptional=true: выключает required', () => {
    const guard = createGuard<string, string>(() => undefined);

    const error = guard.define({ isOptional: true })(undefined);

    expect(error?.message).toBeUndefined();
  });

  it('Создает новый контекст, если его не было', () => {
    const guard = createGuard<string, string>((_, ctx) => {
      expect(ctx.global.values).toBe('');

      return undefined;
    });

    guard('');
  });
});
