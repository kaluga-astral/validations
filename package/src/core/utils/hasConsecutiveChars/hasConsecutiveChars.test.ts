import { hasConsecutiveChars } from './hasConsecutiveChars';

describe('hasConsecutiveChars', () => {
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
    (value) => expect(hasConsecutiveChars(value)).toBeTruthy(),
  );
});
