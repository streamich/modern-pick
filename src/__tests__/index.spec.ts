import {pick} from '..';

const data = {
  store: {
    book: [
      {
        category: 'reference',
        author: 'Nigel Rees',
        title: 'Sayings of the Century',
        price: 8.95,
      },
      {
        category: 'fiction',
        author: 'Evelyn Waugh',
        title: 'Sword of Honour',
        price: 12.99,
      },
      {
        category: 'fiction',
        author: 'Herman Melville',
        title: 'Moby Dick',
        isbn: '0-553-21311-3',
        price: 8.99,
      },
      {
        category: 'fiction',
        author: 'J. R. R. Tolkien',
        title: 'The Lord of the Rings',
        isbn: '0-395-19395-8',
        price: 22.99,
      },
    ],
    bicycle: {
      color: 'red',
      price: 19.95,
    },
  },
};

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
          author: 'Garry',
        },
      ],
    });
    expect(res).toBe('Garry');
  });

  test('can pick object', () => {
    const picker = pick`books[1]`;
    const res = picker({
      books: [
        {
          author: 'Garry',
        },
        {
          author: 'John',
        },
      ],
    });
    expect(res).toEqual({author: 'John'});
  });

  test('can pick filter', () => {
    const picker = pick`books${(b) => b.price > 10}`;
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
      ],
    });
    expect(res).toEqual([
      {
        author: 'John',
        price: 12,
      },
    ]);
  });

  test('can pick after filtering', () => {
    const picker = pick`books${(b) => b.price > 10}[0].author`;
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
      ],
    });
    expect(res).toEqual('John');
  });

  test('can filter object keys', () => {
    const picker = pick`${(b) => b.time > 110}[0].name`;
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

  test('can select range', () => {
    const picker = pick`${'0:3'}`;
    const res = picker([0, 1, 2, 3, 4, 5, 6]);
    expect(res).toEqual([0, 1, 2]);
  });

  test('can select last element', () => {
    const picker = pick`${'-1:'}`;
    const res = picker([0, 1, 2, 3, 4, 5, 6]);
    expect(res).toEqual([6]);
  });

  test('exclude last element', () => {
    const picker = pick`${':-1'}`;
    const res = picker([0, 1, 2, 3, 4, 5, 6]);
    expect(res).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test('select even elements', () => {
    const picker = pick`${'::2'}`;
    const res = picker([0, 1, 2, 3, 4, 5, 6]);
    expect(res).toEqual([0, 2, 4, 6]);
  });

  test('select odd elements', () => {
    const picker = pick`${'1::2'}`;
    const res = picker([0, 1, 2, 3, 4, 5, 6]);
    expect(res).toEqual([1, 3, 5]);
  });
});

describe('JSONPath examples', () => {
  // XPath: /store/book/author
  // JSONPath: $.store.book[*].author
  test('select authors of all books', () => {
    const picker = pick`store.book${Boolean}->author`;
    const res = picker(data);
    expect(res).toEqual(['Nigel Rees', 'Evelyn Waugh', 'Herman Melville', 'J. R. R. Tolkien']);
  });

  // XPath: /store/book/author
  // JSONPath: $.store.book[*].author
  test('select authors of all books, using map operator', () => {
    const picker = pick`store.book${0}->author`;
    const res = picker(data);
    expect(res).toEqual(['Nigel Rees', 'Evelyn Waugh', 'Herman Melville', 'J. R. R. Tolkien']);
  });

  // XPath: /store/*
  // JSONPath: $.store.*
  test('All things in store', () => {
    const picker = pick<any, any>`store${''}`;
    const res = picker(data);
    expect(res).toBeInstanceOf(Array);
    expect(res.length).toBe(2);
  });

  test('select third book', () => {
    const picker = pick`store.book[2]`;
    const res = picker(data);
    expect(res).toEqual(data.store.book[2]);
  });

  test('select last book', () => {
    const picker = pick`store.book${'-1:'}[0]`;
    pf(picker);
    const res = picker(data);
    expect(res).toEqual(data.store.book[data.store.book.length - 1]);
  });

  test('select fist two books', () => {
    const picker = pick`store.book${':2'}`;
    pf(picker);
    const res = picker(data);
    expect(res).toEqual([data.store.book[0], data.store.book[1]]);
  });

  test('select category and author from all books', () => {
    const picker = pick`store.book${''}->{category,author}`;
    const res = picker(data);
    expect(res).toEqual([
      {category: 'reference', author: 'Nigel Rees'},
      {category: 'fiction', author: 'Evelyn Waugh'},
      {category: 'fiction', author: 'Herman Melville'},
      {category: 'fiction', author: 'J. R. R. Tolkien'},
    ]);
  });

  test('select range after mapping object', () => {
    const picker = pick`store.book${''}->{category,author}${'1:3'}`;
    const res = picker(data);
    expect(res).toEqual([
      {category: 'fiction', author: 'Evelyn Waugh'},
      {category: 'fiction', author: 'Herman Melville'},
    ]);
  });

  test('pick object keys', () => {
    const picker = pick`{a, b}`;
    const res = picker({a: 'a', b: 'b', c: 'c'});
    expect(res).toEqual({a: 'a', b: 'b'});
  });

  test('select books with ISBN', () => {
    const picker = pick`store.book${(b) => b.isbn}`;
    const res = picker(data);
    expect(res).toEqual([
      {category: 'fiction', author: 'Herman Melville', title: 'Moby Dick', isbn: '0-553-21311-3', price: 8.99},
      {
        category: 'fiction',
        author: 'J. R. R. Tolkien',
        title: 'The Lord of the Rings',
        isbn: '0-395-19395-8',
        price: 22.99,
      },
    ]);
  });

  test('select books with price higher than 10', () => {
    const picker = pick`store.book${(b) => b.price > 10}`;
    const res = picker(data);
    expect(res).toEqual([
      {category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99},
      {
        category: 'fiction',
        author: 'J. R. R. Tolkien',
        title: 'The Lord of the Rings',
        isbn: '0-395-19395-8',
        price: 22.99,
      },
    ]);
  });
});
