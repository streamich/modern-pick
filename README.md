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

Let's instead select only the last user and reformat our query to make it look
like we are doing something smart.

```js
const getUsersOver = pick`
  users.byId
  ${u => over => u.age > over}
  ${'-1:'}
  ->{id,name}
`;
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
