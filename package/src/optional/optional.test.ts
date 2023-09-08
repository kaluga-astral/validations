import { expect } from 'vitest';

import { object } from '../object';
import { string } from '../string';
import { when } from '../when';
import { number } from '../number';

import { optional } from './optional';

describe('optional', () => {
  it('object', () => {
    const validate = optional(object<{}>({}));

    const result = validate(undefined);

    expect(result).toBeUndefined();
  });

  it('string', () => {
    const validate = optional(string());

    const result = validate(undefined);

    expect(result).toBeUndefined();
  });

  it('Позволяет делать optional для вложенных guard', () => {
    const validate = optional(
      when({ is: () => true, then: string(), otherwise: number() }),
    );

    const result = validate(undefined);

    expect(result).toBeUndefined();
  });
});
