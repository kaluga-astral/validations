import { describe, expect } from 'vitest';

import { IndependentValidationRule, REQUIRED_ERROR_INFO } from '../../rule';
import { createErrorCode } from '../../errors';
import { optional } from '../../../optional';
import { createContext } from '../../context';

import { createGuard } from './createGuard';

describe('createGuard', () => {
  it('Создает guard, который возвращает ошибку', () => {
    const errorCode = createErrorCode('error');

    const guard = createGuard((_, ctx) => {
      return ctx.createError({ message: 'myerror', code: errorCode });
    });

    const error = guard('value');

    expect(error?.message).toBe('myerror');
    expect(error?.cause.code).toBe(errorCode);
  });

  it('По-дефолту проверяет правило на required', () => {
    const guard = createGuard(() => undefined);

    const error = guard(undefined);

    expect(error?.cause.code).toBe(REQUIRED_ERROR_INFO.code);
  });

  describe('guard.define', () => {
    it('Cоздает копию guard', () => {
      const guard = createGuard(() => undefined);

      const error = guard.define({})('value');

      expect(error).toBeUndefined();
    });

    it('Позволяет переопределить message для ошибки required', () => {
      const guard = createGuard(() => undefined);

      const error = guard.define({ requiredErrorMessage: 'custom message' })(
        undefined,
      );

      expect(error?.message).toBe('custom message');
    });

    it('Позволяет выключить дефолтную проверку на required', () => {
      const guard = createGuard(() => undefined);

      const error = guard.define({ isOptional: true })(undefined);

      expect(error?.message).toBeUndefined();
    });

    it('Пропускает валидацию дальше, если был выключен required и required не вернул ошибку', () => {
      const errorCode = createErrorCode('error');

      const guard = createGuard((_, ctx) =>
        ctx.createError({ message: '', code: errorCode }),
      );

      const error = guard.define({ isOptional: true })('value');

      expect(error?.cause.code).toBe(errorCode);
    });
  });

  it('Создает новый контекст, если его не было', () => {
    const guard = createGuard((_, ctx) => {
      expect(ctx.global.values).toBe(2);

      return undefined;
    });

    guard(2);
  });

  it('Сбрасывает ctx.isOptional для последующей цепочки правил', () => {
    const guard = (rule: IndependentValidationRule<unknown, {}>) =>
      createGuard((value, ctx) => rule(value, ctx));

    const validate = optional(
      guard((_, ctx) => {
        expect(ctx?.isOptional).toBeFalsy();

        return undefined;
      }),
    );

    validate(2);
  });

  it('Отключает required, если в контексте isOptional=true', () => {
    const guard = createGuard(() => undefined);

    const ctx = createContext(undefined, '', { isOptional: true });
    const error = guard(undefined, ctx);

    expect(error?.message).toBeUndefined();
  });

  it('Не перетирает предыдущее значение ctx.values, если в контексте содержится lastSchemaValue', () => {
    const guard = createGuard((_, ctx) => {
      expect(ctx.values).toEqual({ value: 22 });

      return undefined;
    });

    guard(
      { prop: 33 },
      createContext(undefined, '', {
        lastSchemaValue: { value: 22 },
        isOptional: true,
      }),
    );
  });
});
