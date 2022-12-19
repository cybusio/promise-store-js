const chai = require('chai')
const chaiAsPromised = require("chai-as-promised")
const PromiseStore = require('../src/PromiseStore.js')

chai.use(chaiAsPromised)
const { expect } = chai

describe('Class PromiseStore - Unit Tests', () => {

    it('should throw on invalid timeout', () => {
        expect(() => { new PromiseStore({ timeout: 'foo' }) }).to.throw(Error, /timout has to be of type integer, got string/)
        expect(() => { new PromiseStore({ timeout: -1 }) }).to.throw(Error, /timout has to be >= 0, got -1/)
    })

    it('should create a promise', () => {
        const store = new PromiseStore()
        const promise = store.create('foo')
        expect(typeof promise).to.equal('object')
        expect(typeof promise.then).to.equal('function')
    })

    it('should handle promise timeout', () => {
        const store = new PromiseStore({ timeout: 1 })
        return expect(store.create('foo')).to.be.rejectedWith('request timeout')
    })

    it('should store created promises', () => {
        const store = new PromiseStore()
        expect(store.size).to.equal(0)

        const promise = store.create('foo')

        expect(store.size).to.equal(1)
        expect(store._store[0].context).to.equal('foo')
    })

    it('should resolve promises and delete it from the store using filter function', (done) => {
        const store = new PromiseStore()
        expect(store.size).to.equal(0)

        store.create('foo')
            .then(res => {
                expect(res).to.equal('bar')
                expect(store.size).to.equal(0)
                done()
            })
            .catch(err => {
                done(err)
            })

        store.resolve(function (el) { return el.context === 'foo' }, 'bar')
    })

    it('should resolve promises and delete it from the store using regular expression', (done) => {
        const store = new PromiseStore()
        expect(store.size).to.equal(0)

        store.create('foo')
            .then(res => {
                expect(res).to.equal('bar')
                expect(store.size).to.equal(0)
                done()
            })
            .catch(err => {
                done(err)
            })

        store.resolve(/foo/, 'bar')
    })

    it('should delete promise on timeout', async () => {
        const store = new PromiseStore({ timeout: 0 })
        expect(store.size).to.equal(0)

        try {
            await store.create('foo')
        } catch (err) { }

        expect(store.size).to.equal(0)
    })

    it('should throw on invalid filter function', async () => {
        const store = new PromiseStore()

        expect(() => {
            store.resolve(0)
        }).to.throw(Error, /Unexpected filter type/)

        expect(() => {
            store.resolve({ foo: 'bar' })
        }).to.throw(Error, /Unexpected filter type/)

        store.create('foo')
    })
})
