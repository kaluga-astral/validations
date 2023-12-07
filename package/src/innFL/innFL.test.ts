import { INN_FL_ERROR_INFO } from './constants';
import { innFL } from './innFL';

describe('innFL', () => {
  it.each<string>(['447572010132'])('Value "%s" валидно', (value) => {
    expect(innFL()(value)).toBeUndefined();
  });

  it('ИНН ФЛ невалиден, если состоит целиком из нулей', () => {
    const result = innFL()('000000000000');

    expect(result).toBeUndefined();
  });

  it.each<string>([
    'a',
    '123a',
    '        1      ',
    'undefined',
    'NaN',
    'number',
    '3842129527',
    '384212952a20',
    '+384212952720',
    '7728168911',
    '000000000001',
    '000000000010',
    '010000000000',
    '000000000100',
  ])('Value "%s" невалидно', (value) => {
    const error = innFL()(value);

    expect(error?.cause.code).toBe(INN_FL_ERROR_INFO.code);
  });

  it('Дефолтный message переопределяется через параметры', () => {
    const customMessage = 'CustomMessage';

    const error = innFL({ message: customMessage })('123');

    expect(error?.message).toBe(customMessage);
  });

  it('Exclude позволяет отключить проверку для определенных value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(innFL({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
