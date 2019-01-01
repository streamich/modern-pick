import {pick} from '..';

test('abc', () => {
  const data = {a: {b: {c: 'Yes!'}}};
  const res = pick`a.b.c`()(data); // 👉 Yes!
  expect(res).toBe('Yes!');
});

test('predicate', () => {
  const res = pick`${x => x < 3}`()([1, 2, 3]);
  expect(res).toEqual([1, 2]);
});

test('boolean predicate', () => {
  const data = {users: [{name: 'foo'}]};
  const res = pick`users${Boolean}[0].name`()(data); // 👉 fo
  expect(res).toEqual('foo');
});

test('interpolated accessor', () => {
  const res = pick`a.${'b'}`()({a: {b: 'c'}});
  expect(res).toEqual('c');
});

test('interpolated accessor', () => {
  const res = pick`.${'a'}.${'b'}`()({a: {b: 'c'}});
  expect(res).toEqual('c');
});

test('interpolated accessor', () => {
  const res = pick`.${'a'}`()({a: 'b'});
  expect(res).toEqual('b');
});

test('interpolated functional accessor', () => {
  const selector = pick`users.${id => id}`;
  const res = selector(3)({
    users: {
      3: {
        id: 3,
      }
    }
  }); // 👉{id: 3}
  expect(res).toEqual({id: 3});
});

test('interpolated functional accessor second argument', () => {
  const selector = pick`users.${(_, id) => id}`;
  const res = selector('lala', 3)({
    users: {
      3: {
        id: 3,
      }
    }
  }); // 👉{id: 3}
  expect(res).toEqual({id: 3});
});

test('range - select odd numbers', () => {
  const res = pick`${'::2'}`()([1, 2, 3, 4]);
  expect(res).toEqual([1, 3]);
});

test('destructuring', () => {
  const res = pick`{a}`()({a: 1, b: 2});
  expect(res).toEqual({a: 1});
});

test('mapping accessor', () => {
  const res = pick`->a`()([{a: 1}, {a: 2}]);
  expect(res).toEqual([1, 2]);
});

test('mapping destructuring', () => {
  const res = pick`->{b}`()([{a: 1, b: 'b'}, {a: 2, b: 'b'}]);
  expect(res).toEqual([{b: 'b'}, {'b': 'b'}]);
});
