# Promise-Store-JS

Create and handle [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise?retiredLocale=de) in a simple manner.
Especially useful for TCP based protocol implementations.

```js
const PromiseStore = require("promise-store-js");

const store = new PromiseStore();

store
  .create("myPromise")
  .then((res) => console.log("myPromise resolved with:", res));

store.resolve(function (el) {
  return el.context === "myPromise";
}, "Hello World");
```

# Install

This module is available through the [npm registry](https://www.npmjs.com/).

```console
$ npm install promise-store-js
```

# Features

- Simple Promise creation
- Configurable timeout
- Resolve Promises by using custom filter functions

# API

## new PromiseStore([options])

Create an instance to create and handle promises.

The following table describes the properties of the optional `options` object.
| Property | Description | Type | Default |
|---|---|---|---|
| timeout | Time in milliseconds a promise times out | Number | 6000 |

## Methods

### PromiseStore.create(context)

This creates a `Promise` and returns it.

The `context` argument can be of `any` type and is ment to be used for filtering.

### PromiseStore.resolve(filter, value)

Resolve one or more `Promises` previously created.

The `filter` argument has to be a `function`. It should return a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) to resolve the matching `Promise`, and a falsy value otherwise.

```js
function (el) { return el.context === 'foo' }
```

The `value` argument can be of `any` type and will be the promise result.

## Properties

### PromiseStore.size

Returns the number of `Promises` currently pending.

# Examples

[https://github.com/cybusio/promise-store-js/tree/master/examples]()
