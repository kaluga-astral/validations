import { MOBILE_PHONE_ERROR_INFO } from './constants';
import { mobilePhone } from './mobilePhone';

describe('mobilePhone', () => {
  it.each<string>(['79999999999'])('Value "%s" валидно', (value) => {
    expect(mobilePhone()(value)).toBeUndefined();
  });

  it.each<string>([
    '89999999999',
    '78999999999',
    '7999999999',
    '+79999999999',
    '7(999)9999999',
    '7 (999) 99-99-999',
    '7 (999) 999-99-99',
    '7(999)999-99-99',
  ])('Value "%s" невалидно', (value) => {
    const error = mobilePhone()(value);

    expect(error?.cause.code).toBe(MOBILE_PHONE_ERROR_INFO.code);
  });

  it('Дефолтный message переопределяется через параметры', () => {
    const customMessage = 'CustomMessage';

    const error = mobilePhone({ message: customMessage })('q');

    expect(error?.message).toBe(customMessage);
  });

  it('Exclude позволяет отключить проверку для определенных value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(mobilePhone({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
