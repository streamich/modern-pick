# `id`

`id` is the *identity function*.

```js
const id = state => state;
```

It can be used with `pick` to create selectors *by-id*.

```js
const getPostById = pick`posts.byId.${id}`;
```

Instead of:

```js
const getPostById = pick`posts.byId.${x => x}`;
```

Or a no-no:


```js
const getPostById = postId => pick`posts.byId.${postId}`;
```

P.S. The last example is "bad" because it will compile a new selector
on evere `getPostById` invocation, wheras the two above will compile
only one selector.
