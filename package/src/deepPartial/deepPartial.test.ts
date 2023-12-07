import { object } from '../object';
import { string } from '../string';
import { array } from '../array';
import { arrayItem } from '../arrayItem';
import { when } from '../when';
import { optional } from '../optional';

import { deepPartial } from './deepPartial';

describe('deepPartial', () => {
  it('Все вложенные объекты в схеме становятся partial', () => {
    const validate = deepPartial(
      object<{ name: string; surname: string; lastName: string; info: {} }>({
        name: string(),
        surname: when({
          is: () => true,
          then: string(),
          otherwise: optional(string()),
        }),
        lastName: () => string(),
        info: object<{ name: string; info: {} }>({
          name: string(),
          info: object<{ name: string }>({ name: string() }),
        }),
      }),
    );

    const result = validate({ info: { info: {} } });

    expect(result).toBeUndefined();
  });

  it('Все вложенные объекты становятся partial даже, если они находятся в массиве', () => {
    const validate = deepPartial(
      object<{ name: string; info: {} }>({
        name: string(),
        info: object<{ name: string; array: [] }>({
          name: string(),
          array: array(arrayItem(object<{ name: string }>({ name: string() }))),
        }),
      }),
    );

    const result = validate({ info: { array: [{}] } });

    expect(result).toBeUndefined();
  });
});
