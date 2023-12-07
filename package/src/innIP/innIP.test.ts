import { INN_IP_ERROR_INFO } from './constants';
import { innIP } from './innIP';

describe('innIP', () => {
  it.each<string>(['384212952720'])('Value "%s" валидно', (value) => {
    expect(innIP()(value)).toBeUndefined();
  });

  it('ИНН ИП, состоящее целиком из нулей невалидно', () => {
    const error = innIP()('000000000000');

    expect(error?.cause.code).toBe(INN_IP_ERROR_INFO.code);
  });

  it('ИНН ИП, начинающийся на "00" невалиден', () => {
    const error = innIP()('004212952720');

    expect(error?.cause.code).toBe(INN_IP_ERROR_INFO.code);
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
    const error = innIP()(value);

    expect(error?.cause.code).toBe(INN_IP_ERROR_INFO.code);
  });

  it('Дефолтный message переопределяется через параметры', () => {
    const customMessage = 'CustomMessage';

    const error = innIP({ message: customMessage })('123');

    expect(error?.message).toBe(customMessage);
  });

  it('Exclude позволяет отключить проверку для определенных value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(innIP({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
