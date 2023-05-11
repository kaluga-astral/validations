import { createErrorCode, createSimpleError } from '../errors';

import { compose } from './compose';

describe('compose', () => {
  it('Выполняет правила слева направо', () => {
    const validate = compose(
      () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error1',
        }),
      () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error2',
        }),
    );

    expect(validate(null)?.message).toBe('error1');
  });

  it('Поддерживается вложенность', () => {
    const composed1 = compose(
      () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error1',
        }),
      () =>
        createSimpleError({
          code: createErrorCode('error'),
          message: 'error1',
        }),
    );
    const validate = compose(() => undefined, composed1);

    expect(validate(null)?.message).toBe('error1');
  });
});
