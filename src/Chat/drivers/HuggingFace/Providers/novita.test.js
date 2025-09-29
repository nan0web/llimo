import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import novita from './novita.js'

suite('novita provider', () => {
  it('should have name and url', () => {
    assert.equal(novita.name, 'novita')
    assert.ok(novita.url)
  })

  it('should have models array', () => {
    assert.ok(Array.isArray(novita.models))
  })

  it('should have models with Model instances and prices', () => {
    for (const model of novita.models) {
      assert.ok(model.name)
      assert.ok(model.prices)
      assert.ok(model.prices.input)
      assert.ok(model.prices.output)
    }
  })

  it('should parse prices correctly', () => {
    const models = novita.models
    const model = models.find(m => m.is('DeepSeek-V3-0324'))
    assert.ok(model)
    assert.closeTo(model.prices.input, 0.28, 0.01)
    assert.closeTo(model.prices.output, 1.14, 0.01)
  })
})