import { expect } from 'vitest';

import { INVALID_GUID_ERROR_INFO } from './constants';
import { guid } from './guid';

describe('guid', () => {
  it.each<string>([
    'C56a418065aa426ca9455fd21deC0538',
    'C56A4180-65AA-42EC-A945-5FD21DEC',
    '7728168971',
    'C72A4140-67AA-42AF-B6945-5FD21D',
  ])('Invalid for: %s', (value) => {
    const validate = guid();
    const error = validate(value);

    expect(error?.cause.code).toEqual(INVALID_GUID_ERROR_INFO.code);
  });

  it.each<string>([
    '9ab46fde-a6b3-4898-af3d-56625519f152',
    'c56a4180-65aa-42ec-a945-5fd21dec0538',
    'C56A4180-65AA-42EC-A945-5FD21DEC0538',
    'B24070A9-15F7-44B3-8A65-0869548E55FE',
  ])('Valid for: %s', (value) => {
    const validate = guid();
    const result = validate(value);

    expect(result).toBeUndefined();
  });

  it('Validate custom message', () => {
    const customMessage = 'CustomMessage';
    const validate = guid({ message: customMessage });
    const error = validate('test@');

    expect(error?.message).toBe(customMessage);
  });
});
