import { INN_IP_ERROR_INFO } from './constants';
import { innIP } from './innIP';

describe('innIP', () => {
  it.each<string>(['384212952720'])('Valid for: %s', (value) => {
    expect(innIP()(value)).toBeUndefined();
  });

  it('Возвращает ошибку, если ИНН ИП состоит целиком из нулей', () => {
    const error = innIP()('000000000000');

    expect(error?.cause.code).toBe(INN_IP_ERROR_INFO.code);
  });

  it('Возвращает ошибку, если ИНН ИП начинается с "00" ', () => {
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
  ])('Invalid for: %s', (value) => {
    const error = innIP()(value);

    expect(error?.cause.code).toBe(INN_IP_ERROR_INFO.code);
  });

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';

    const error = innIP({ message: customMessage })('123');

    expect(error?.message).toBe(customMessage);
  });

  it('Valid exclude value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(innIP({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
