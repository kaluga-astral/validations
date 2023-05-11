import { expect } from 'vitest';

import { createErrorCode } from '../../errors';

import { CommonRuleParams, createRule } from './createRule';

describe('createRule', () => {
  it('Создает правило валидации, которое возвращает ошибку', () => {
    const rule = () =>
      createRule<string>((_, ctx) =>
        ctx.createError({ code: createErrorCode('error'), message: 'error' }),
      );

    const error = rule()('');

    expect(error?.message).toBe('error');
  });

  it('Если нет контекста, то создается новый', () => {
    const rule = () =>
      createRule<string>((_, ctx) => {
        expect(typeof ctx === 'object').toBeTruthy();

        return undefined;
      });

    rule()('value');
  });

  it('Params.exclude: пропускает исключения, если exclude возвращает true', () => {
    const rule = ({ exclude }: CommonRuleParams<string>) =>
      createRule<string>(
        (_, ctx) =>
          ctx.createError({ code: createErrorCode('error'), message: 'error' }),
        { exclude },
      );

    expect(rule({ exclude: () => true })('value')?.message).toBeUndefined();
    expect(rule({ exclude: () => false })('value')?.message).toBe('error');
  });
});
