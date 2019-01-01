# `idx`

`idx` lets you create selectors using accessor syntax.

```js
const getWeatherIcon = idx(_ => _.weather.list[0].weather[0].icon);
```

You can also specify default value.

```js
const getWeatherIcon = idx(_ => _.weather.list[0].weather[0].icon, 'sunny.png');
```

It gives you back a selector function.

```js
getWeatherIcon(state); // 👉 "cloudy.svg"
```
