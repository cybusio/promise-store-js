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
        let promises = null

        switch (typeof filter) {
            case 'function': promises = this._store.filter(filter); break;
            case 'string':
            case 'object':
                if (!(filter instanceof RegExp)) throw new Error('Unexpected filter type')
                const re = new RegExp(filter)
                promises = this._store.filter(el => { return re.test(el.context) })
                break;
            default: throw new Error('Unexpected filter type')
        }

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