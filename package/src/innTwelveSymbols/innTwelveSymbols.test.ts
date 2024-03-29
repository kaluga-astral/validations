import { INN_12_SYMBOLS_ERROR_INFO } from './constants';
import { innTwelveSymbols } from './innTwelveSymbols';

describe('innTwelveSymbols', () => {
  it.each<string>(['447572010132', '384212952720'])(
    'Value "%s" валидно',
    (value) => {
      expect(innTwelveSymbols()(value)).toBeUndefined();
    },
  );

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
    const error = innTwelveSymbols()(value);

    expect(error?.cause.code).toBe(INN_12_SYMBOLS_ERROR_INFO.code);
  });

  it('Дефолтный message переопределяется через параметры', () => {
    const customMessage = 'CustomMessage';

    const error = innTwelveSymbols({ message: customMessage })('123');

    expect(error?.message).toBe(customMessage);
  });

  it('Exclude позволяет отключить проверку для определенных value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(innTwelveSymbols({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
