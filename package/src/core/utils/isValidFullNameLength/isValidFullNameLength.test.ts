import { isValidFullNameLength } from './isValidFullNameLength';

describe('isValidFullNameLength', () => {
  it('Допускается минимальное количество символов - 1', () => {
    expect(isValidFullNameLength('')).toBeTruthy();
  });

  it('Допускается максимальное количество символов - 200', () => {
    expect(isValidFullNameLength('а'.repeat(201))).toBeTruthy();
  });

  it('Допускается минимальное количество символов - 1', () => {
    expect(isValidFullNameLength('а')).toBeFalsy();
  });

  it('Допускается максимальное количество символов - 200', () => {
    expect(isValidFullNameLength('а'.repeat(200))).toBeFalsy();
  });
});
