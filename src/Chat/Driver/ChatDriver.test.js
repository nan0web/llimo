import { describe, it } from "node:test"
import assert from "node:assert"
import ChatDriver from './ChatDriver.js'
import Model from '../Model/Model.js'
import ChatMessage from '../Message.js'

// Simplified without mocks
describe('ChatDriver', () => {
	/** @type {ChatDriver} */
	let driver

	it('should initialize and fetch model', async () => {
		driver = new ChatDriver({
			auth: { apiKey: 'test' },
			model: Model.from({ name: 'model' }),
			db: {}
		})
		await driver.init()
		assert.ok(driver.model)
	})

	it('should generate unique ID', () => {
		const id1 = ChatDriver.uniqueID()
		const id2 = ChatDriver.uniqueID()
		assert.notStrictEqual(id1, id2)
	})

	it('should get model by name', async () => {
		const model = await driver.getModel("model")
		assert.ok(model)
	})

	it('should decode prompt', () => {
		const decoded = driver._decodePrompt('Hello')
		assert.ok(decoded instanceof ChatMessage)
	})

	it('should get tokens', async () => {
		const tokens = await driver.getTokens('test')
		assert.ok(Array.isArray(tokens))
	})

	it('should get tokens count', async () => {
		const count = await driver.getTokensCount('test')
		assert.strictEqual(typeof count, 'number')
	})

	it('should merge objects', () => {
		const obj1 = { a: 1 }
		const obj2 = { b: 2 }
		const result = driver.merge(obj1, obj2)
		assert.strictEqual(result.a, 1)
		assert.strictEqual(result.b, 2)
	})

	it('should parse chat completion response', async () => {
		const res = {
			json: async () => ({
				choices: [{ message: { content: 'ok' } }],
				id: 'id',
				model: 'model'
			})
		}
		const data = await driver._parseChatCompletionResponse(res)
		assert.ok(data)
		assert.ok(data.choices)
	})

	it('should parse chat completion response text', async () => {
		const text = 'data: {"id":"id","choices":[{"delta":{"content":"hi"}}]}'
		const result = driver._parseChatCompletionResponseText(text)
		assert.ok(result)
		assert.strictEqual(result.choices[0].delta.content, 'hi')
	})
})
