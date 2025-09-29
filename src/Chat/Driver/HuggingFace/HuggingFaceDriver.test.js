import { describe, it } from "node:test"
import assert from "node:assert"
import HuggingFaceDriver from './HuggingFaceDriver.js'
import Model from "../../Model/Model.js"

// Simplified without mocks
describe('HuggingFaceDriver', () => {
	let driver
	const model = Model.from({ name: 'deepseek-ai/DeepSeek-V3' })

	it('should initialize client', async () => {
		driver = new HuggingFaceDriver({
			auth: { apiKey: 'test' },
			model,
			options: {
				provider: "novita",
			}
		})
		await driver.init()
		assert.ok(driver.client)
	})

	it('should get model by name', () => {
		const modelFound = driver.getModel('deepseek-ai/DeepSeek-V3')
		assert.ok(modelFound)
	})

	it('should throw if client not initialized', () => {
		const d = new HuggingFaceDriver({ auth: { apiKey: 'test' } })
		d.client = null
		assert.throws(() => d.requireClient(), /Hugging Face API client is not initialized/)
	})
})
