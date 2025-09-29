import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import OpenAIDriver from './OpenAIDriver.js'
import ChatMessage from '../../Message.js'

suite('OpenAIDriver', () => {
  let driver, model
  
  it('beforeEach', async () => {
    driver = new OpenAIDriver({
      auth: { apiKey: 'test' },
      model: { name: 'model' },
      db: new OpenAIDriver.DB(),
    })
    model = await driver.getModel('gpt-4.1')
    await driver.init()
  })

  it('should initialize with API', async () => {
    assert.ok(driver.api)
  })

  it('should perform chat', async () => {
    const prompt = ChatMessage.from({ role: 'user', content: 'hi' })
    const res = await driver.chat(prompt, model)
    assert.equal(res.content, 'response')
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
    assert.ok(info.name)
  })
})