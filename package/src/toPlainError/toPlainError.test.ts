import { object } from '../object';
import { array } from '../array';
import { arrayItem } from '../arrayItem';
import { STRING_TYPE_ERROR_INFO, string } from '../string';
import { ErrorInfo } from '../core';

import { toPlainError } from './toPlainError';

describe('toPlainError', () => {
  it('SimpleError преобразуется в простой объект', () => {
    const validate = string();

    const plainError = toPlainError(validate(22), (err) => err.message);

    expect(plainError).toEqual(STRING_TYPE_ERROR_INFO.message);
  });

  it('object: преобразует вложенные объекты ошибок в простые объекты', () => {
    const validate = object<{ info: {} }>({
      info: object<{ name: string }>({ name: string() }),
    });
    const error = validate({ info: { name: 22 } });

    const plainError = toPlainError<ErrorInfo>(error, (err) => ({
      message: err.message,
      code: err.cause.code,
    }));

    const expectedPlainError = {
      info: { name: STRING_TYPE_ERROR_INFO },
    };

    expect(plainError).toEqual(expectedPlainError);
  });

  it('object: преобразует вложенные в объекты массивы ошибок', () => {
    const validate = object<{ info: {} }>({
      info: array(arrayItem(object<{ name: string }>({ name: string() }))),
    });
    const error = validate({ info: [{ name: 22 }] });

    const plainError = toPlainError<ErrorInfo>(error, (err) => ({
      message: err.message,
      code: err.cause.code,
    }));

    const expectedPlainError = {
      info: [{ name: STRING_TYPE_ERROR_INFO }],
    };

    expect(plainError).toEqual(expectedPlainError);
  });

  it('object: не добавляет undefined в свойства объекта', () => {
    const validate = object<{ name: string; surname: string }>({
      name: string(),
      surname: string(),
    });
    const error = validate({ name: 22, surname: 'surnname' });

    const plainError = toPlainError<ErrorInfo>(error, (err) => ({
      message: err.message,
      code: err.cause.code,
    }));

    const expectedPlainError = { name: STRING_TYPE_ERROR_INFO };

    expect(plainError).toEqual(expectedPlainError);
  });

  it('array: преобразует ArrayError в массив, который может содержать undefined', () => {
    const validate = array(
      arrayItem(object<{ name: string }>({ name: string() })),
    );
    const error = validate([{ name: 'name' }, { name: 22 }]);

    const plainError = toPlainError<ErrorInfo>(error, (err) => ({
      message: err.message,
      code: err.cause.code,
    }));

    const expectedPlainError = [undefined, { name: STRING_TYPE_ERROR_INFO }];

    expect(plainError).toEqual(expectedPlainError);
  });

  it('Если нет ошибок валидации, то возвращается undefined', () => {
    const validate = object<{ name: string; surname: string }>({
      name: string(),
      surname: string(),
    });

    const result = toPlainError(
      validate({ name: 'name', surname: 'surnname' }),
      (err) => err,
    );

    expect(result).toBeUndefined();
  });
});
