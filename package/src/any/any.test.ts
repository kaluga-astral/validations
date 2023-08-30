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

  it('any позволяет делать композицию для правил', () => {
    const validate = any(
      transform((value) => {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          value instanceof Date
        ) {
          return new Date(value);
        } else {
          throw new Error('Некорректный тип переданного значения');
        }
      }, date()),
    );

    const result = validate('12.22.2022');

    expect(result).toBeUndefined();
  });
});
