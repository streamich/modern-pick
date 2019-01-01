# modern-pick

Modern selector/picker library utilizing JavaScript template literals.

```js
const data = {
  weather: {
    data: {
      days: [{
        conditions: {temperatuer: 26}
      }]
    }
  }
});
pick`weather.data.days[0].conditions.temperature`()(data);
// 👉 26
```

Let's say you have a normalized Redux store.

```js
{
  users: {
    byId: {
      // 1: {}
      // 2: {}
      // 3: {}
    }
  }
}
```

And you want to select all users aged over 18.

```js
const getUsersOver18 = pick`users.byId${({age}) => age > 18}`();
```

Let's make the age threshold variable.

```js
const getUsersOver = pick`users.byId${({age}) => over => u.age > over}`;
const getUsersOver18 = getUsersOver(18);
```

Let's limit the number of users to only first five.

```js
const getUsersOver = pick`users.byId${u => over => u.age > over}${'0:5'}`;
```

Let's select only `id` and `name` fields.

```js
const getUsersOver = pick`users.byId${u => over => u.age > over}${'0:5'}->{id,name}`;
```

Let's instead select only the last user and reformat our query to make it look smart.

```js
const getUsersOver = pick`
  users.byId
  ${u => over => u.age > over}
  ${'-1:'}
  ->{id,name}
`;
```

Let's break it down.

- `users.byId` &mdash; this is an *accessor*, it is compiled to `state = state.users.byId`.
- `${u => over => u.age > over}` &mdash; this *filter* expression is compiled to `state = state.filter(u => u.age > over)`.
- `${'-1:'}` &mdash; this is a range expression in `start:end:step` format, it is compiled internally to a *filter*, too.
- `->` &mdash; *map* operator `->` tells us to do `state = state.map(...)` over the result set.
- `{id,name}` &mdash; *destructuring accessor* is internally compiled to `state = (({id, name}) => ({id, name})(state)`.

All-in-all the above query is compiled to a JavaScript function like this:

```js
const getUsersOver = (over) => (state, def) => {
  try {
    state = state.users.byId;
    state = Object.values(state);
    state = state.filter(u => u.age > over);
    state = state.filter((_, i) => i === state.length - 1);
    state = stat.map(({id, name}) => ({id, name}));
    return state;
  } catch {
    return def;
  }
};
```


## Usage

Install.

```shell
npm i modern-pick
```

Import.

```js
import {id, idx, pick} from 'modern-pick';
```


## Reference

- [`id`](./docs/id.md) &mdash; identity function
- [`idx`](./docs/idx.md) &mdash; basic accessors
- [`pick`](./docs/pick.md) &mdash; pimped accessors


## License

[Unlicense](LICENSE) &mdash; public domain.
