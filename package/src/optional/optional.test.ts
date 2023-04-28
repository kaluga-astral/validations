import { expect } from 'vitest';

import { OBJECT_TYPE_ERROR_INFO, object } from '../object';
import { REQUIRED_ERROR_INFO } from '../core';

import { optional } from './optional';

describe('optional', () => {
  it('Выключает optional для guard ', () => {
    const optionalGuard = optional(object<{}>({}));
    const requiredGuard = object<{}>({});

    const optionalError = optionalGuard(undefined);
    const requiredError = requiredGuard(undefined);

    expect(optionalError?.cause.code).toBe(OBJECT_TYPE_ERROR_INFO.code);
    expect(requiredError?.cause.code).toBe(REQUIRED_ERROR_INFO.code);
  });
});
