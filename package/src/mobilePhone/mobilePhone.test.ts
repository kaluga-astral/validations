import { MOBILE_PHONE_ERROR_INFO } from './constants';
import { mobilePhone } from './mobilePhone';

describe('mobilePhone', () => {
  it.each<string>(['79999999999'])('Valid for: %s', (value) => {
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
  ])('Invalid for: %s', (value) => {
    const error = mobilePhone()(value);

    expect(error?.cause.code).toBe(MOBILE_PHONE_ERROR_INFO.code);
  });

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';

    const error = mobilePhone({ message: customMessage })('q');

    expect(error?.message).toBe(customMessage);
  });

  it('Valid exclude value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    expect(mobilePhone({ exclude: isExclude })('exclude')).toBeUndefined();
  });
});
