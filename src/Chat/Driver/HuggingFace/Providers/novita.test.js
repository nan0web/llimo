import { describe, it } from "node:test"
import assert from "node:assert"
import { deepStrictEqual } from "node:assert"
import novita from './novita.js'

describe('novita provider', () => {
	it('should have name and url', () => {
		assert.ok(novita.hasOwnProperty('name'))
		assert.strictEqual(novita.name, 'novita')
		assert.ok(novita.hasOwnProperty('url'))
	})

	it('should have models array', () => {
		assert.ok(Array.isArray(novita.models))
	})

	it('should have models with Model instances and prices', () => {
		for (const model of novita.models) {
			assert.ok(model.hasOwnProperty('name'))
			assert.ok(model.prices)
			assert.ok(model.prices.hasOwnProperty('input'))
			assert.ok(model.prices.hasOwnProperty('output'))
		}
	})

	it('should parse prices correctly', () => {
		const models = novita.models
		const model = models.find(m => m.is && m.is('DeepSeek-V3-0324'))
		assert.ok(model)
		assert.ok(Math.abs(model.prices.input - 0.28) < 0.01)
		assert.ok(Math.abs(model.prices.output - 1.14) < 0.01)
	})
})