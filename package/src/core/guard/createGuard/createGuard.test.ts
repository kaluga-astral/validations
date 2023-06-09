import { REQUIRED_ERROR_INFO } from '../../rule';
import { createErrorCode } from '../../errors';

import { createGuard } from './createGuard';

describe('createGuard', () => {
  it('Создает guard, который возвращает ошибку', () => {
    const errorCode = createErrorCode('error');

    const guard = createGuard<string>((_, ctx) => {
      return ctx.createError({ message: 'myerror', code: errorCode });
    });

    const error = guard('value');

    expect(error?.message).toBe('myerror');
    expect(error?.cause.code).toBe(errorCode);
  });

  it('По-дефолту проверяет правило на required', () => {
    const guard = createGuard<string>(() => undefined);

    const error = guard(undefined);

    expect(error?.cause.code).toBe(REQUIRED_ERROR_INFO.code);
  });

  it('guard.define: создает копию guard', () => {
    const guard = createGuard<string>(() => undefined);

    const error = guard.define({})('value');

    expect(error).toBeUndefined();
  });

  it('guard.define:requiredErrorMessage: переопределяет message для required', () => {
    const guard = createGuard<string>(() => undefined);

    const error = guard.define({ requiredErrorMessage: 'custom message' })(
      undefined,
    );

    expect(error?.message).toBe('custom message');
  });

  it('guard.define:isOptional=true: выключает required', () => {
    const guard = createGuard<string>(() => undefined);

    const error = guard.define({ isOptional: true })(undefined);

    expect(error?.message).toBeUndefined();
  });

  it('guard.define:isOptional=true: если required не вернул ошибку, то пропускает валидацию дальше', () => {
    const errorCode = createErrorCode('error');

    const guard = createGuard<string>((_, ctx) =>
      ctx.createError({ message: '', code: errorCode }),
    );

    const error = guard.define({ isOptional: true })('value');

    expect(error?.cause.code).toBe(errorCode);
  });

  it('Создает новый контекст, если его не было', () => {
    const guard = createGuard<string>((_, ctx) => {
      expect(ctx.global.values).toBe('');

      return undefined;
    });

    guard('');
  });
});
