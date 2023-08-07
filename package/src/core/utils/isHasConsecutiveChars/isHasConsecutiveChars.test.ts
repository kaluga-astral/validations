import { isHasConsecutiveChars } from './isHasConsecutiveChars';

describe('isHasConsecutiveChars', () => {
  it.each([
    'Тест--Тест',
    'Тест++Тест',
    'Тест__Тест',
    'Тест//Тест',
    'Тест||Тест',
    'Тест??Тест',
    'Тест!!Тест',
    'Тест<<Тест',
    'Тест..Тест',
    'Тест,,Тест',
    'Тест::Тест',
    'Тест==Тест',
    'Тест@@Тест',
    'Тест``Тест',
    'Тест  Тест',
  ])(
    'Invalid for %s: Не может содержать последовательно два спецсимвола/пробела',
    (value) => expect(isHasConsecutiveChars(value)).toBeTruthy(),
  );
});
