import {pick} from '..';

const pf = (fn) =>
  // tslint:disable-next-line
  console.log(require('js-beautify').js_beautify(fn.toString(), {indent_size: 2}));

describe('pick()', () => {
  test('exists', () => {
    expect(typeof pick).toBe('function');
  });

  test('can pick object value', () => {
    const res = pick`value`({value: 123});
    expect(res).toBe(123);
  });

  test('can pick from nested array', () => {
    const res = pick`books[0].author`({
      books: [
        {
          author: 'Garry'
        }
      ]
    });
    expect(res).toBe('Garry');
  });

  test('can pick object', () => {
    const picker = pick`books[1]`;
    const res = picker({
      books: [
        {
          author: 'Garry'
        },
        {
          author: 'John'
        },
      ]
    });
    expect(res).toEqual({author: 'John'});
  });

  test('can pick filter', () => {
    const picker = pick`books${b => b.price > 10}`;
    const res = picker({
      books: [
        {
          author: 'Garry',
          price: 4.45,
        },
        {
          author: 'John',
          price: 12,
        },
      ]
    });
    expect(res).toEqual([{
      author: 'John',
      price: 12,
    }]);
  });

  test('can pick after filtering', () => {
    const picker = pick`books${b => b.price > 10}[0].author`;
    const res = picker({
      books: [
        {
          author: 'Garry',
          price: 4.45,
        },
        {
          author: 'John',
          price: 12,
        },
      ]
    });
    expect(res).toEqual('John');
  });

  test('can filter object keys', () => {
    const picker = pick`${b => b.time > 110}[0].name`;
    pf(picker);
    const res = picker({
      a: {
        time: 100,
        name: 'foo',
      },
      b: {
        time: 200,
        name: 'bar',
      },
    });
    expect(res).toEqual('bar');
  });
});
