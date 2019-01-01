# `pick`

`pick` compiles accessor-style JSON queries to selector functions.

```js
const data = {a: {b: {c: 'Yes!'}}};
pick`a.b.c`()(data); // 👉 Yes!
```


## Accessors

In the string part of template string literals you specify *accessors*, those
can be any JavaScript expressions, like:

```js
pick`property`
pick`response.data.customers[0].details.address`
```

Those get compiled to straight JavaScript:

```js
state = state.property
state = state.response.data.customers[0].details.address
```


## `${predicate}` Filters

You can specify *filters* to filter out data using template string interpolations,
where you have to provide a *predicate*. Predicate is a function that returns
a boolean&mdash;`true` to keep an entry, `false` to remove.

```js
pick`${x => x < 3}`()([1, 2, 3]) // 👉 [1, 2]
```

You can combine filters with accessors.

```js
const data = {users: [{name: 'foo'}]};
pick`users${Boolean}[0].name`()(data) // 👉 foo
```

`Boolean` predicate simply says: "Pick all elements". Above query simply
compiles to:

```js
state = state.users;
state = state.filter(Boolean);
state = state[0].name;
```


## `${range}` Filters

`range` is a string in `start:end:step` format. Internally it is compiled to
a predicate function and applied as a filter.

You can ommit values, like `1:` to skip first element.

Or `:-1` to skip the last element.

As you can see, you can also use negative values, for example, `-1:` to select
only te last value.

```js
pick`${'::2'}`()([1, 2, 3, 4]) // 👉 [1, 3]
```


## `.${string}` Interpolated Accessors

If you precede interpolation `${}` with a dot `.`, it will be interpreted as
an accessor instead.

```js
pick`.${'a'}`()({a: 'b'}) // 👉 b
```


## `.${fn}` Interpolated Functional Accessors

Instead of specifyin a constant value, you can also use a function. This
fuction receives all the arguments supplied to your selector.

```js
const selector = pick`users.${id => id}`;
selector(3)({
  users: {
    3: {
      id: 3,
    }
  }
}); // 👉{id: 3}
```

Using functional accessors is great because you can compile your selector
only once and use it for different parameters.

You can use the identity function [`id`](./id.md) to rewrite your selector like this:

```js
const selector = pick`users.${id}`;
```


## Destructuring

You can easily select a subset of fiels by using *destructuring*.

```js
pick`{a}`()({a: 1, b: 2}) // 👉 {a: 1}
```

Internally destructuring is compiled to JavaScript function argument destrucuting syntax.

```js
state = (({a}) => ({a}))(state);
```

N.B. This feature will not work if you JavaScript does not support destructuring
syntax.


## `->` Mapping Accessors and Destructuring

Instead of apploying your accessors directly to the state, you can *map* it.
This will apploy your *accessors* or *destructuring* to each element element
using the `.map()` method.

```js
pick`->a`()([{a: 1}, {a: 2}]);
// 👉 [1, 2]
```

Similarly, you can map *destructuring*.

```js
pick`->{b}`()([
  {a: 1, b: 'b'},
  {a: 2, b: 'b'}
]);
// 👉 [{b: "b"}, {b: "b"}]
```
