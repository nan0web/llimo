import { describe, it } from "node:test"
import assert from "node:assert"
import { deepStrictEqual } from "node:assert"
import OpenAIDriver from './OpenAIDriver.js'
import ChatMessage from '../../Message.js'

// Simplified without mocks
describe('OpenAIDriver', () => {
	let driver, model

	it('should initialize with API', async () => {
		driver = new OpenAIDriver({
			auth: { apiKey: 'test' },
			model: { name: 'model' },
			db: new OpenAIDriver.DB(),
		})
		model = await driver.getModel('gpt-4.1')
		await driver.init()
		assert.ok(driver.api)
		assert.ok(model)
	})

	it('should require db', async () => {
		await driver.requireDb()
		assert.ok(driver.db)
	})

	it('should get usage', async () => {
		const usage = await driver.getUsage([2024, 1, 1], [2024, 12, 31])
		assert.ok(usage)
	})

	it('should get models', async () => {
		const models = await driver.getModels()
		assert.ok(Array.isArray(models))
	})

	it('should get model info', async () => {
		const info = await driver.getModel('gpt-4.1')
		assert.ok(info)
		assert.ok(info.hasOwnProperty('name'))
	})
})