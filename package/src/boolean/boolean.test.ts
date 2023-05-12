import { BOOLEAN_TYPE_ERROR_INFO } from './constants';
import { boolean } from './boolean';

describe('boolean', () => {
  it.each<unknown>(['string', new Date(), {}, Symbol(), 22])(
    'Invalid for: %s',
    (value) => {
      const error = boolean()(value);

      expect(error?.cause.code).toBe(BOOLEAN_TYPE_ERROR_INFO.code);
    },
  );

  it('Valid for true', () => {
    const result = boolean()(true);

    expect(result).toBeUndefined();
  });

  // TODO: расскомменитровать после удаления required из guard
  // it('Valid for false', () => {
  //   const result = boolean()(false);
  //
  //   expect(result).toBeUndefined();
  // });
});
