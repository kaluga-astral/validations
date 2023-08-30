import { object } from '../object';
import { transform } from '../transform';
import { date } from '../date';

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

  it('Принимает transform() для валидации значения в input', () => {
    //@ts-ignore
    const validate = any(transform((value) => new Date(value), date()));

    const result = validate('12.22.2022');

    expect(result).toBeUndefined();
  });
});
