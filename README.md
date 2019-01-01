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

- `users.byId` &mdash; this is a "selector" aka accessor, it is compiled to `(state) => state.users.byId`.
- `${u => over => u.age > over}` &mdash; this is a filter expression it is compiled to `over => state => state.filter(u => over => u.age > over)`
- `${'-1:'}` &mdash; this is a range expression in `start:end:step` format, it is compiled internally to a filter expression.
- `->` &mdash; map operator `->` tells us to do `.map()` over the result set.
- `{id,name}` &mdash; destructuring accessor is internally compiled to `({id,name}) => ({id,name})`.

All in all the above query is compiled to something like this:

```js
const picker = (over) => (state, def) => {
  try {
    state = state.users.byId;
    state = Object.values(state);
    state = state.filter(u => u.age > over);
    state = state.filter((_, i) => i === state.length - 1);
    state = (({id, name}) => ({id, name}))(state);
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
import {pick, id, idx} from 'modern-pick';
```


## Reference

...


## License

[Unlicense](LICENSE) &mdash; public domain.
