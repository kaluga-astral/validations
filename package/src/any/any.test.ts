import { object } from '../object';
import { personName } from '../personName';
import { string } from '../string';
import { max } from '../max';
import { min } from '../min';

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

  it('any позволяет делать композицию для правил', () => {
    const validate = any(string(personName(), max(9), min(5)));

    const result = validate('Иван-Иван');

    expect(result).toBeUndefined();
  });
});
