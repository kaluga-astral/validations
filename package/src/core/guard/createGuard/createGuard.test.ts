import { createSimpleError } from '../../errors';
import { REQUIRED_ERROR_INFO } from '../../rule';
import { createContext } from '../../context';

import { createGuard } from './createGuard';

describe('createGuard', () => {
  it('Создает guard, который возвращает ошибку', () => {
    const errorCode = Symbol();

    const guard = createGuard<string, string>((_, ctx) => {
      return ctx.createError({ message: 'myerror', code: errorCode });
    });

    const error = guard('');

    expect(error?.message).toBe('myerror');
    expect(error?.cause.code).toBe(errorCode);
  });

  it('По-дефолту проверяет правило на required', () => {
    const guard = createGuard<string, string>(() => undefined);

    const error = guard(undefined);

    expect(error?.cause.code).toBe(REQUIRED_ERROR_INFO.code);
  });

  it('ctx.isOptional=false: отключается проверка на required', () => {
    const guard = createGuard<string, string>(() => undefined);

    const error = guard(
      undefined,
      createContext(
        {
          isOptional: true,
          createError: createSimpleError,
          values: '',
        },
        '',
      ),
    );

    expect(error).toBeUndefined();
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

  it('Создает новый контекст, если его не было', () => {
    const guard = createGuard<string, string>((_, ctx) => {
      expect(ctx.isOptional).toBeTruthy();

      return undefined;
    });

    guard('');
  });
});
