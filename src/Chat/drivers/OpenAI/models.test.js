import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import models from './models.js'
import Model from '../../Model.js'

suite('OpenAI Models', () => {
  it('should contain models with prices', () => {
    assert.ok(typeof models === 'object')
    assert.ok(Object.keys(models).includes('gpt-4.1'))
    assert.ok(models['gpt-4.1'].prices.input)
  })
  
  it('should create model correctly', () => {
    const data = ['o1-pro', {
      prices: { i: 150.00, o: 600, speed: 1 },
      input: ['text', 'image'], output: ['text'],
      context: { window: 200_000, output: 100_000, date: '2023-10-01' },
    }]
    
    const model = Model.from({ ...data[1], name: data[0] })
    assert.ok(model instanceof Model)
    assert.equal(model.name, 'o1-pro')
    assert.deepEqual(model.prices, { input: 150.00, output: 600, speed: 1, batchDiscount: 0, cache: 0, currency: 'USD' })
    assert.deepEqual(model.input, ['text', 'image'])
    assert.deepEqual(model.output, ['text'])
    assert.deepEqual(model.context, { window: 200_000, output: 100_000, date: '2023-10-01', input: 100_000, name: '' })
  })
})