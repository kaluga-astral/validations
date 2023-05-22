import { object } from '../object';

import { any } from './any';

describe('any', () => {
  it('Не производит никаких проверок', () => {
    const result = any()(undefined);

    expect(result).toBeUndefined();
  });

  it('object: выключает любые проверки (включая required)', () => {
    type Values = { name: string; surname?: string };

    const validate = object<Values>({ name: any(), surname: any() });

    const result = validate({});

    expect(result).toBeUndefined();
  });
});
