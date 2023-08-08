import { codePassport } from './codePassport';
import { CODE_PASSPORT_ERROR_INFO } from './constants';

describe('codePassport', () => {
  it('Допускается длина поля - 6 цифр. Маска кода ХХX-ХХX', () => {
    expect(codePassport()('123-256')).toBeUndefined();
  });

  it.each(['000-456', '001-433', '009-222', '00-456'])(
    'Invalid for %s: Не может начинаться с двух нулей',
    (value) => {
      const error = codePassport()(value);

      expect(error?.cause.code).toBe(CODE_PASSPORT_ERROR_INFO.code);
    },
  );

  it.each(['124-556', '125-435', '126-434', '129-732'])(
    'Invalid for %s: Третья цифра в коде должна принимать значения: 0, 1, 2, 3',
    (value) => {
      const error = codePassport()(value);

      expect(error?.cause.code).toBe(CODE_PASSPORT_ERROR_INFO.code);
    },
  );

  it.each(['124 556', '125/435', '126@434', '129|732', '235=532', '325.433'])(
    'Invalid for %s: Допускается использовать дефис',
    (value) => {
      const error = codePassport()(value);

      expect(error?.cause.code).toBe(CODE_PASSPORT_ERROR_INFO.code);
    },
  );

  it.each([
    '',
    '12-234',
    '1264-434',
    '1-732',
    '23',
    '334-3',
    '234-34',
    '535-6544',
  ])(
    'Invalid for %s: Допускается длина поля - 6 цифр. Маска кода ХХX-ХХX',
    (value) => {
      const error = codePassport()(value);

      expect(error?.cause.code).toBe(CODE_PASSPORT_ERROR_INFO.code);
    },
  );

  it('Должна возвращать ошибку с пользовательским сообщением', () => {
    const customMessage = 'Пользовательское сообщение';
    const error = codePassport({ message: customMessage })('err');

    expect(error?.message).toBe(customMessage);
  });
});
