import { expect } from 'vitest';

import { object } from '../object';
import { string } from '../string';

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
});
