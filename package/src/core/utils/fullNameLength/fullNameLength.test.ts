import { fullNameLength } from './fullNameLength';

describe('fullNameLength', () => {
  it('Допускается минимальное количество символов - 1', () => {
    expect(fullNameLength('')).toBeTruthy();
  });

  it('Допускается максимальное количество символов - 200', () => {
    expect(fullNameLength('а'.repeat(201))).toBeTruthy();
  });

  it('Допускается минимальное количество символов - 1', () => {
    expect(fullNameLength('а')).toBeFalsy();
  });

  it('Допускается максимальное количество символов - 200', () => {
    expect(fullNameLength('а'.repeat(200))).toBeFalsy();
  });
});
