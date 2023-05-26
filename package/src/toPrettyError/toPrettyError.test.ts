import { object } from '../object';
import { array } from '../array';
import { arrayItem } from '../arrayItem';
import { STRING_TYPE_ERROR_INFO, string } from '../string';

import { toPrettyError } from './toPrettyError';

describe('toPrettyError', () => {
  it('Для SimpleError возвращает строку', () => {
    const validate = string();

    const error = toPrettyError(validate(22));

    expect(error).toBe(STRING_TYPE_ERROR_INFO.message);
  });

  it('object: преобразует вложенные объекты ошибок в message', () => {
    const validate = object<{ info: {} }>({
      info: object<{ name: string }>({ name: string() }),
    });
    const baseError = validate({ info: { name: 22 } });

    const error = toPrettyError(baseError);

    const expectedError = {
      info: { name: STRING_TYPE_ERROR_INFO.message },
    };

    expect(error).toEqual(expectedError);
  });

  it('array: преобразует ArrayError в массив, который может содержать undefined', () => {
    const validate = array(
      arrayItem(object<{ name: string }>({ name: string() })),
    );
    const error = validate([{ name: 'name' }, { name: 22 }]);

    const plainError = toPrettyError(error);

    const expectedPlainError = [
      undefined,
      { name: STRING_TYPE_ERROR_INFO.message },
    ];

    expect(plainError).toEqual(expectedPlainError);
  });
});

type ListItem = { description: string };

type Values = {
  info: { name: string };
  list: ListItem[];
};

const validate = object<Values>({
  info: object<Values['info']>({ name: string() }),
  list: array(
    arrayItem(
      object<ListItem>({
        description: string(),
      }),
    ),
  ),
});

const error = validate({
  info: { name: 22 },
  list: [{}],
});

// {
//   info: { name: 'Не является строкой' },
//   list: [{ description: 'Обязательно' }],
// }
toPrettyError(error);
