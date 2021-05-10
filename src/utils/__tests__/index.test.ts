import { indexOutOfBounds } from '../index';

describe('indexOutOfBounds', () => {
  const list = [false, 1, '4'];
  it('returns false if index is in bounds', () => {
    expect.assertions(3);
    expect(indexOutOfBounds(0, list)).toStrictEqual(false);
    expect(indexOutOfBounds(1, list)).toStrictEqual(false);
    expect(indexOutOfBounds(2, list)).toStrictEqual(false);
  });

  it('returns true if index is out of bounds', () => {
    expect.assertions(3);
    expect(indexOutOfBounds(-1, list)).toStrictEqual(true);
    expect(indexOutOfBounds(3, list)).toStrictEqual(true);
    expect(indexOutOfBounds(100, list)).toStrictEqual(true);
  });
});
