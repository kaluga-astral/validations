import { REQUIRED_ERROR_INFO } from '../../rule';
import { createErrorCode } from '../../errors';

import { createAsyncGuard } from './createAsyncGuard';

describe('createAsyncGuard', () => {
  it('Создает guard, который возвращает ошибку', async () => {
    const errorCode = createErrorCode('error');

    const guard = createAsyncGuard(async (_, ctx) => {
      return ctx.createError({ message: 'myerror', code: errorCode });
    });

    const error = await guard('value');

    expect(error?.message).toBe('myerror');
    expect(error?.cause.code).toBe(errorCode);
  });

  it('По-дефолту проверяет правило на required', async () => {
    const guard = createAsyncGuard(async () => undefined);

    const error = await guard(undefined);

    expect(error?.cause.code).toBe(REQUIRED_ERROR_INFO.code);
  });

  it('guard.define: создает копию guard', async () => {
    const guard = createAsyncGuard(async () => undefined);

    const error = await guard.define({})('value');

    expect(error).toBeUndefined();
  });

  it('guard.define:requiredErrorMessage: переопределяет message для required', async () => {
    const guard = createAsyncGuard(async () => undefined);

    const error = await guard.define({
      requiredErrorMessage: 'custom message',
    })(undefined);

    expect(error?.message).toBe('custom message');
  });

  it('guard.define:isOptional=true: выключает required', async () => {
    const guard = createAsyncGuard(async () => undefined);

    const error = await guard.define({ isOptional: true })(undefined);

    expect(error?.message).toBeUndefined();
  });

  it('guard.define:isOptional=true: если required не вернул ошибку, то пропускает валидацию дальше', async () => {
    const errorCode = createErrorCode('error');

    const guard = createAsyncGuard(async (_, ctx) =>
      ctx.createError({ message: '', code: errorCode }),
    );

    const error = await guard.define({ isOptional: true })('value');

    expect(error?.cause.code).toBe(errorCode);
  });

  it('Создает новый контекст, если его не было', async () => {
    const guard = createAsyncGuard(async (_, ctx) => {
      expect(ctx.global.values).toBe('');

      return undefined;
    });

    await guard('');
  });
});
