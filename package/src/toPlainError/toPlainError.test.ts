import { object } from '../object';
import { array } from '../array';
import { arrayItem } from '../arrayItem';
import { STRING_TYPE_ERROR_INFO, string } from '../string';

import { toPlainError } from './toPlainError';

describe('toPlainError', () => {
  it('SimpleError преобразуется в простой объект', () => {
    const validate = toPlainError(string());

    const plainError = validate(22);

    expect(plainError).toEqual(STRING_TYPE_ERROR_INFO);
  });

  it('object: преобразует вложенные объекты ошибок в простые объекты', () => {
    const validate = toPlainError(
      object<{ info: {} }>({
        info: object<{ name: string }>({ name: string() }),
      }),
    );

    const plainError = validate({ info: { name: 22 } });

    const expectedPlainError = {
      info: { name: STRING_TYPE_ERROR_INFO },
    };

    expect(plainError).toEqual(expectedPlainError);
  });

  it('object: преобразует вложенные в объекты массивы ошибок', () => {
    const validate = toPlainError(
      object<{ info: {} }>({
        info: array(arrayItem(object<{ name: string }>({ name: string() }))),
      }),
    );

    const plainError = validate({ info: [{ name: 22 }] });

    const expectedPlainError = {
      info: [{ name: STRING_TYPE_ERROR_INFO }],
    };

    expect(plainError).toEqual(expectedPlainError);
  });

  it('object: не добавляет undefined в свойства объекта', () => {
    const validate = toPlainError(
      object<{ name: string; surname: string }>({
        name: string(),
        surname: string(),
      }),
    );

    const plainError = validate({ name: 22, surname: 'surnname' });

    const expectedPlainError = { name: STRING_TYPE_ERROR_INFO };

    expect(plainError).toEqual(expectedPlainError);
  });

  it('array: преобразует ArrayError в массив, который может содержать undefined', () => {
    const validate = toPlainError(
      array(arrayItem(object<{ name: string }>({ name: string() }))),
    );

    const plainError = validate([{ name: 'name' }, { name: 22 }]);

    const expectedPlainError = [undefined, { name: STRING_TYPE_ERROR_INFO }];

    expect(plainError).toEqual(expectedPlainError);
  });

  it('Если нет ошибок валидации, то возвращается undefined', () => {
    const validate = toPlainError(
      object<{ name: string; surname: string }>({
        name: string(),
        surname: string(),
      }),
    );

    const result = validate({ name: 'name', surname: 'surnname' });

    expect(result).toBeUndefined();
  });
});
