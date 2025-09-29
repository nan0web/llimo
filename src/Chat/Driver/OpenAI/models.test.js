import { describe, it } from "node:test"
import assert from "node:assert"
import { deepStrictEqual } from "node:assert"
import models from './models.js'
import { ChatModel } from '../../../Chat/index.js'

describe('OpenAI Models', () => {
	it('should contain models with prices', () => {
		assert.ok(models instanceof Object)
		assert.ok(Object.keys(models).includes('gpt-4.1'))
		assert.ok(models['gpt-4.1'].prices.hasOwnProperty('input'))
		assert.equal(models['gpt-4.1'].prices.batchDiscount, 0.5)
	})

	it('should create model correctly', () => {
		const data = ["o1-pro", {
			prices: { i: 150.00, o: 600, speed: 1 },
			input: ["text", "image"], output: ["text"],
			context: { window: 200_000, output: 100_000, date: "2023-10-01" },
		}]
		const model = ChatModel.from({ ...data[1], name: data[0] })
		assert.ok(model instanceof ChatModel)
		assert.strictEqual(model.name, 'o1-pro')
		deepStrictEqual({ ...model.prices }, { input: 150, output: 600, speed: 1, batchDiscount: 0, cache: 0, currency: 'USD' })
		deepStrictEqual(model.input, ["text", "image"])
		deepStrictEqual(model.output, ["text"])
		deepStrictEqual({ ...model.context }, {
			window: 200000,
			output: 100000,
			date: '2023-10-01',
			input: 100000,
			name: 'o1-pro',
			isModerated: false,
		})
	})
})
