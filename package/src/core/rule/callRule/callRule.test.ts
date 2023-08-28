import { ValidationRule } from '../types';
import { createContext } from '../../context';

import { callRule } from './callRule';

describe('callRule', () => {
  it('Позволяет правилу возвращать другое правило', () => {
    const rule: ValidationRule<unknown> = () => () => undefined;

    expect(callRule(rule, '', createContext(undefined, ''))).toBe(undefined);
  });
});
