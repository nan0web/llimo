import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ChatDriver from './ChatDriver.js'
import Response from '../Response.js'
import ChatMessage from '../Message.js'

suite('ChatDriver', () => {
  let driver
  it('beforeEach', () => {
    driver = new ChatDriver({ auth: { apiKey: 'test' }, model: { name: 'model' }, db: {} })
  })

  it('should initialize and fetch model', async () => {
    await driver.init()
    assert.ok(driver.model)
  })

  it('should generate unique ID', () => {
    const id1 = ChatDriver.uniqueID()
    const id2 = ChatDriver.uniqueID()
    assert.notEqual(id1, id2)
  })

  it('should get model by name', () => {
    const model = driver.getModel('model')
    assert.ok(model)
  })

  it('should decode prompt', () => {
    const prompt = { toArray: () => [{ role: 'user', content: 'hi' }] }
    const msg = driver._decodePrompt(prompt)
    assert.ok(msg.toArray)
  })

  it('should get tokens', async () => {
    const tokens = await driver.getTokens('test')
    assert.ok(Array.isArray(tokens))
  })

  it('should get tokens count', async () => {
    const prompt = ChatMessage.from({ role: 'user', content: 'hi' })
    const count = await driver.getTokensCount(prompt)
    assert.equal(typeof count, 'number')
  })

  it('should merge objects', () => {
    const obj1 = { a: 1, nested: { b: 2 } }
    const obj2 = { nested: { c: 3 } }
    const result = driver.merge(obj1, obj2)
    assert.equal(result.nested.c, 3)
  })

  it('should parse chat completion response', async () => {
    const res = { json: () => Promise.resolve({ choices: [{ message: { content: 'ok' } }], id: 'id', model: 'model' }) }
    const data = await driver._parseChatCompletionResponse(res)
    assert.ok(data.choices)
  })

  it('should parse chat completion response text', () => {
    const text = 'data: {"created":123,"choices":[{"delta":{"content":"hi"}}],"id":"id"}'
    const context = {}
    const result = driver._parseChatCompletionResponseText(text, context)
    assert.ok(result.choices)
  })
})