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
        const sore = new PromiseStore({ timeout: 1 })
        return expect(sore.create('foo')).to.be.rejectedWith('request timeout')
    })

    it('should store created promises', () => {
        const sore = new PromiseStore()
        expect(sore.size).to.equal(0)

        const promise = sore.create('foo')

        expect(sore.size).to.equal(1)
        expect(sore._store[0].context).to.equal('foo')
    })

    it('should resolve promises and delete it from the sore', (done) => {
        const sore = new PromiseStore()
        expect(sore.size).to.equal(0)

        sore.create('foo')
            .then(res => {
                expect(res).to.equal('bar')
                expect(sore.size).to.equal(0)
                done()
            })
            .catch(err => {
                done(err)
            })

        sore.resolve(function (el) { return el.context === 'foo' }, 'bar')
    })

    it('should delete promise on timeout', async () => {
        const sore = new PromiseStore({ timeout: 0 })
        expect(sore.size).to.equal(0)

        try {
            await sore.create('foo')
        } catch (err) { }

        expect(sore.size).to.equal(0)
    })

    it('should throw on invalid filter function', async () => {
        const sore = new PromiseStore()

        expect(() => {
            sore.resolve('foo')
        }).to.throw(Error, /filter is not a function/)

        expect(() => {
            sore.resolve(() => { })
        }).to.throw(Error, /arrow function not supported as filter/)

        sore.create('foo')
    })
})
