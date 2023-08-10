import { expect } from 'vitest';

import { kpp } from './kpp';
import { INVALID_KPP_ERROR_INFO } from './constants';

describe('KPP', () => {
  it.each<string>(['249443332', '082645444', '0826AD444', '0826ZE444'])(
    'Valid for: %s',
    (value) => {
      const validate = kpp();
      const result = validate(value);

      expect(result).toBeUndefined();
    },
  );

  it('Возвращает ошибку, если КПП состоит целиком из нулей', () => {
    const validate = kpp();
    const error = validate('000000000');

    expect(error?.cause.code).toEqual(INVALID_KPP_ERROR_INFO.code);
  });

  it('Возвращает ошибку, если КПП начинается на 00', () => {
    const validate = kpp();
    const error = validate('0026SA454');

    expect(error?.cause.code).toEqual(INVALID_KPP_ERROR_INFO.code);
  });

  it.each<string>(['a', '95145370511', '156-573-259 92'])(
    'Invalid for: %s',
    (value) => {
      const validate = kpp();
      const error = validate(value);

      expect(error?.cause.code).toEqual(INVALID_KPP_ERROR_INFO.code);
    },
  );

  it('Valid custom message', () => {
    const customMessage = 'CustomMessage';
    const validate = kpp({ message: customMessage });
    const error = validate('321321');

    expect(error?.message).toBe(customMessage);
  });

  it('Valid exclude value', () => {
    const isExclude = (value: unknown) => {
      const excluded: unknown[] = ['exclude'];

      return excluded.includes(value);
    };

    const validate = kpp({ exclude: isExclude });
    const result = validate('exclude');

    expect(result).toBeUndefined();
  });
});
