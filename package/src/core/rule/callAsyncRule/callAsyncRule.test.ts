import { AsyncValidationRule } from '../types';
import { createContext } from '../../context';
import { REJECT_PROMISE_ERROR_INFO } from '../../errors';

import { callAsyncRule } from './callAsyncRule';

describe('callAsyncRule', () => {
  it('Позволяет правилу возвращать другое правило', async () => {
    const rule: AsyncValidationRule<unknown> = async () => async () =>
      undefined;

    const result = await callAsyncRule(rule, '', createContext(undefined, ''));

    expect(result).toBe(undefined);
  });

  it('Если в одном из правил произошла ошибка, то promise не отклонится и вернется внутренняя ошибка', async () => {
    const rule: AsyncValidationRule<unknown> = async () => async () => {
      throw Error();
    };

    const result = await callAsyncRule(rule, '', createContext(undefined, ''));

    expect(result?.cause.code).toBe(REJECT_PROMISE_ERROR_INFO.code);
  });
});
