const PromiseStore = require('promise-store-js')

const store = new PromiseStore()

store.create('myPromise 1')
    .then(res => console.log('myPromise 1 resolved with:', res))

store.create('myPromise 2')
    .catch(err => console.log('myPromise 2 rejected with:', err.message))

store.resolve(function (el) { return el.context === 'myPromise 1' }, 'Hello World')