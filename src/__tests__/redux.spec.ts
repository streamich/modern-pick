import {pick} from '..';
import {ancestorWhere} from 'tslint';

const state = {
  ui: {
    activeUser: 2,
  },
  users: {
    byId: {
      1: {
        id: 1,
        name: 'John',
        age: 33,
      },
      2: {
        id: 2,
        name: 'Maria',
        age: 12,
      },
      3: {
        id: 3,
        name: 'Albert',
        age: 22,
      },
      4: {
        id: 4,
        name: 'Norbert',
        age: 55,
      },
      5: {
        id: 5,
        name: 'Gustafbert',
        age: 16,
      },
    },
    newUsers: [
      2,
    ],
  }
};

/*
test('getUserById()', () => {
  const getActiveUserId = pick`ui.activeUser`;
  const getUserById = (id) => pick`users.byId.${id}`;
  const getActiveUser = state => getUserById(getActiveUserId(state));
});
*/


test('pick normalized data by ID', () => {
  const picker = (userId) => pick<any, any>`users.byId.${userId}`;
  const res = picker(2)(state);
  expect(res.name).toBe('Maria');
});

test('pick normalized data by ID - pregenerate selector arguments', () => {
  const picker = pick<any, any>`users.byId.${userId => userId}`;
  const res = picker(2)(state);
  expect(res.name).toBe('Maria');
});

test('complex query - 1', () => {
  const picker = pick<any,any>`users.byId${({age}) => age > 18}${'1:5'}->{id}`;
  const res = picker(state);
  expect(res).toEqual([ { id: 3 }, { id: 4 } ]);
});

test('complex query - 2', () => {
  const picker = pick<any,any>`
    users.byId
    ${({age}) => age > 18}
    ${'1:5'}
    ->
    {id}`;
  const res = picker(state);
  expect(res).toEqual([ { id: 3 }, { id: 4 } ]);
});
