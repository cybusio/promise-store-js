class PromiseStore {
    constructor(options = {}) {
        this._timeout = options.timeout ?? 6000
        if (!Number.isInteger(this._timeout)) throw new Error(`timout has to be of type integer, got ${typeof this._timeout}`)
        if (this._timeout < 0) throw new Error(`timout has to be >= 0, got ${this._timeout}`)

        this._store = []
    }

    async create(context) {
        let resolve, reject = null
        const promise = new Promise((res, rej) => {
            resolve = res
            reject = rej
        })

        const timeout = setTimeout(() => {
            this._removePromise(promise)
            reject(new Error('request timeout'))
        }, this._timeout)

        this._store.push({ promise, resolve, reject, timeout, context })

        return promise
    }

    resolve(filter, value) {
        if (typeof filter !== 'function') throw new Error(`filter is not a function`)
        if (!filter.toString().startsWith('function ')) throw new Error(`arrow function not supported as filter`)
        const _filter = filter.bind({})
        const promises = this._store.filter(_filter)
        promises.forEach((el) => {
            clearTimeout(el.timeout)
            el.resolve(value)
            this._removePromise(el.promise)
        })
    }

    _removePromise(promise) {
        this._store = this._store.filter(el => el.promise !== promise)
    }

    get size() {
        return this._store.length
    }
}

module.exports = PromiseStore