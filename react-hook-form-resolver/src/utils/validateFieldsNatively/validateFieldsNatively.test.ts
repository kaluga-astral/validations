// Тест скопирован из https://github.com/react-hook-form/resolvers/blob/master/src/__tests__/validateFieldsNatively.ts
import { describe, expect, it } from 'vitest';
import {
  type Field,
  type FieldError,
  type InternalFieldName,
} from 'react-hook-form';

import { validateFieldsNatively } from './validateFieldsNatively';

describe('validateFieldsNatively', () => {
  const setup = () => {
    const errors: Record<string, FieldError> = {
      name: { type: 'st', message: 'first message' },
    };

    const arrayReportValiditySpy = vi.fn();
    const arraySetCustomValiditySpy = vi.fn();

    const fields = {
      name: {
        ref: {
          reportValidity: vi.fn(),
          setCustomValidity: vi.fn(),
        },
      },
      nd: {
        ref: {
          reportValidity: vi.fn(),
          setCustomValidity: vi.fn(),
        },
      },
      array: {
        refs: [
          {
            reportValidity: arrayReportValiditySpy,
            setCustomValidity: arraySetCustomValiditySpy,
          },
          {
            reportValidity: arrayReportValiditySpy,
            setCustomValidity: arraySetCustomValiditySpy,
          },
        ],
      },
    } as unknown as Record<InternalFieldName, Field['_f']>;

    validateFieldsNatively(errors, {
      fields,
      shouldUseNativeValidation: true,
    });

    return {
      fields,
      errors,
      arraySetCustomValiditySpy,
      arrayReportValiditySpy,
    };
  };

  it('В setCustomValidity передается сообщение об ошибке, если ошибка есть для поля', () => {
    const { fields, errors } = setup();

    expect(
      (fields.name.ref as HTMLInputElement).setCustomValidity,
    ).toHaveBeenCalledWith(errors.name.message);
  });

  it('В setCustomValidity передается пустая строка, если ошибки для поля нет', () => {
    const { fields } = setup();

    expect(
      (fields.nd.ref as HTMLInputElement).setCustomValidity,
    ).toHaveBeenCalledWith('');
  });

  it('reportValidity вызывается для поля, если произошла ошибка', () => {
    const { fields } = setup();

    expect(
      (fields.name.ref as HTMLInputElement).reportValidity,
    ).toHaveBeenCalledTimes(1);
  });

  it('reportValidity для массива вызывается для каждого item, в котором произошла ошибка', () => {
    const { arrayReportValiditySpy } = setup();

    expect(arrayReportValiditySpy).toHaveBeenCalledTimes(2);
  });

  it('setCustomValidity для массива вызывается для каждого item, в котором произошла ошибка', () => {
    const { arraySetCustomValiditySpy } = setup();

    expect(arraySetCustomValiditySpy).toHaveBeenCalledTimes(2);
  });
});
