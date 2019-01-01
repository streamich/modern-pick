import {pick} from '..';

describe('pick()', () => {
  test('exists', () => {
    expect(typeof pick).toBe('function');
  });

  test('can pick object value', () => {
    const res = pick`value`({value: 123});
    expect(res).toBe(123);
  });
});
