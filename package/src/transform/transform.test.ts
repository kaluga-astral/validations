import { vi } from 'vitest';

import { string } from '../string';
import { date } from '../date';

import { transform } from './transform';

describe('transform', () => {
  it('Переданный guard получает трансформированное value', () => {
    const validate = string(transform((value) => new Date(value), date()));

    const result = validate('12.12.2022');

    expect(result).toBeUndefined();
  });

  it('После трансформации вызывается цепочка правил', () => {
    const rule1 = vi.fn(() => undefined);
    const rule2 = vi.fn(() => undefined);

    const validate = string(transform((value) => Number(value), rule1, rule2));

    validate('22');
    expect(rule1).toBeCalled();
    expect(rule2).toBeCalled();
  });
});
