import { string } from '../string';
import { object } from '../object';
import { ARRAY_TYPE_ERROR_INFO, array } from '../array';

import { or } from './or';

describe('or', () => {
  it('Останавливает выполнение когда одно из правил завершается без ошибки', () => {
    const validate = or(object<{}>({}), string(), array());

    const result = validate('string');

    expect(result).toBeUndefined();
  });

  it('Возвращает ошибку из последнего правила, если все правила завершились с ошибкой', () => {
    const validate = or(object<{}>({}), string(), array());

    const error = validate(new Date());

    expect(error?.cause.code).toBe(ARRAY_TYPE_ERROR_INFO.code);
  });
});
