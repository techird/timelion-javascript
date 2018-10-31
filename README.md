# timelion-javascript

Timelion expression generator in javascript, for convinent of writing timelion expressions.

Typescript is supported (and strongly recommended because this library contains typings reference the [official document](https://github.com/elastic/timelion/blob/master/FUNCTIONS.md)).

## Install

```sh
npm install timelion --save
```

## Usage

```js
const { timelion } = require("timelion");

timelion
  .es({ q: "*", index: "my_index" })
  .lines({ width: 2, fill: 1 })
  .color('#ff6')
  .compile();
```

[Run the example above in runkit.](https://runkit.com/techird/runkit-npm-timelion)